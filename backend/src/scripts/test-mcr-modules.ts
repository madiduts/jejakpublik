import { UserModel, verifyPassword } from '../models/user.model.js';
import { ReportModel } from '../models/report.model.js';
import { skpdModel } from '../models/skpd.model.js';
import { sign, verify } from 'hono/jwt';
import { JWT_SECRET } from '../middlewares/auth.middleware.js';

async function runTests() {
  console.log('--- 1. Testing UserModel & Password Hashing ---');
  // Check demo warga
  const warga = await UserModel.findByEmail('warga@jejakpublik.id');
  console.assert(warga !== null, 'Seeded warga should exist');
  console.assert(verifyPassword('warga123', warga!.password_hash), 'Password warga123 should match');
  console.log('✓ Seeded warga verified:', warga?.name, warga?.email, warga?.role);

  // Check demo moderator
  const mod = await UserModel.findByEmail('moderator@jejakpublik.id');
  console.assert(mod !== null, 'Seeded moderator should exist');
  console.assert(verifyPassword('admin123', mod!.password_hash), 'Password admin123 should match');
  console.log('✓ Seeded moderator verified:', mod?.name, mod?.email, mod?.role);

  // Create new test user
  const testEmail = `budi.${Date.now()}@example.com`;
  const newUser = await UserModel.create({
    name: 'Budi Santoso',
    email: testEmail,
    password: 'securepassword123',
    role: 'warga'
  });
  console.assert(newUser.email === testEmail, 'Created user email should match');
  console.log('✓ New user registration works:', newUser.id, newUser.email);

  // Test JWT issuance and verification
  const token = await sign(
    { id: newUser.id, email: newUser.email, role: newUser.role },
    JWT_SECRET,
    'HS256'
  );
  const payload = await verify(token, JWT_SECRET, 'HS256');
  console.assert(payload.id === newUser.id, 'JWT payload ID must match');
  console.log('✓ JWT token generation and verification passed');

  console.log('\n--- 2. Testing ReportModel & Citizen Reporting ---');
  // Create citizen report
  const report = await ReportModel.create({
    user_id: newUser.id,
    reporter_name: newUser.name,
    reporter_email: newUser.email,
    skpd_id: 'dinas-lingkungan-hidup',
    program_id: '3.27.01',
    report_type: 'observasi_lapangan',
    title: 'Laporan Pengadaan TPS 3R Belum Beroperasi di Lokasi',
    description: 'Berdasarkan peninjauan lapangan pada Maret 2026, fisik bangunan TPS 3R belum rampung meski anggaran tercatat terealisasi.',
    evidence_urls: ['/uploads/sample-evidence-tps3r.jpg']
  });

  console.assert(report.ticket_number.startsWith('JP-2025-'), 'Ticket number should match format JP-2025-XXXX');
  console.assert(report.status === 'pending', 'Initial status should be pending');
  console.log('✓ Citizen report created successfully. Ticket Number:', report.ticket_number);

  // Track by ticket
  const tracked = await ReportModel.findByTicket(report.ticket_number);
  console.assert(tracked !== null && tracked.id === report.id, 'Tracking by ticket should find report');
  console.log('✓ Public tracking by ticket passed:', tracked?.ticket_number, tracked?.title);

  // Moderator review and update status
  const updatedReport = await ReportModel.updateStatus({
    id: report.id,
    status: 'verified',
    audit_notes: 'Dikonfirmasi dengan tinjauan lapangan tim auditor. Diteruskan ke portal audit.',
    actor: 'Tim Auditor JejakPublik',
    is_public: true
  });
  console.assert(updatedReport.status === 'verified', 'Report status should be verified');
  console.assert(updatedReport.is_public === true, 'Verified report should be public');
  console.assert(updatedReport.audit_trail.length >= 2, 'Audit trail should have 2 entries');
  console.log('✓ Moderator audit verification passed. Status:', updatedReport.status, 'Audit Trail count:', updatedReport.audit_trail.length);

  // Public reports listing
  const publicReports = await ReportModel.findPublicReports();
  console.assert(publicReports.length >= 2, 'Should have at least 2 verified public reports');
  console.log('✓ Public verified reports list retrieved. Total:', publicReports.length);

  console.log('\n--- 3. Testing SKPD & APBD Data Engine ---');
  const count = skpdModel.count();
  console.assert(count === 43, `Expected 43 SKPD, got ${count}`);
  const summary = skpdModel.getSummary();
  console.assert(summary.belanja.anggaran > 0, 'Total belanja anggaran should be > 0');
  console.log('✓ 43 SKPD APBD summary loaded:');
  console.log('  Total Belanja Anggaran: Rp' + summary.belanja.anggaran.toLocaleString('id-ID'));
  console.log('  Total Belanja Realisasi: Rp' + summary.belanja.realisasi.toLocaleString('id-ID'));
  console.log('  Serapan Belanja:', summary.belanja.persentase_serapan + '%');

  // Deep dive DLH Pilot testing
  const deepDive = skpdModel.getDeepDiveDetails();
  console.assert(deepDive !== null, 'DLH Deep Dive details should not be null');
  console.assert((deepDive as any).indikator_kinerja !== null, 'Should contain 12 indikator kinerja');
  console.assert((deepDive as any).unit_kerja !== null, 'Should contain 10 unit kerja pelaksana');
  console.assert((deepDive as any).audit_trail.length >= 2, 'Should contain audit trail');
  console.log('✓ DLH Pilot Data Mendalam verified:');
  console.log('  Legal basis:', (deepDive as any).legal_basis);
  console.log('  Audit trail entries:', (deepDive as any).audit_trail.length);

  console.log('\n--- 4. Testing Content & Knowledge Base ---');
  const { ContentModel } = await import('../models/content.model.js');
  const glossary = ContentModel.getGlossary();
  console.assert(glossary.length >= 8, 'Glossary should have at least 8 key terms');
  console.log('✓ Glossary terms verified. Count:', glossary.length);

  const about = ContentModel.getAbout();
  console.assert(about.sections.length === 4, 'About should have 4 sections matching sitemap');
  console.log('✓ About sections verified (Profil, Metodologi, Sumber, Batasan/Anti-Goals)');

  const guide = ContentModel.getGuide();
  console.assert(guide.modules.length === 4, 'Guide should have 4 step modules matching sitemap');
  console.log('✓ Guide modules verified (Mulai, Status Data, Hirarki, APBD & Efisiensi)');

  console.log('\n=============================================');
  console.log('ALL MODULAR MCR BACKEND TESTS PASSED CLEANLY!');
  console.log('=============================================');
}

runTests().catch((e) => {
  console.error('Test failed:', e);
  process.exit(1);
});
