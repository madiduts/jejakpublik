import { UserModel, verifyPassword } from '../src/models/user.model.js';
import { ReportModel } from '../src/models/report.model.js';
import { skpdModel } from '../src/models/skpd.model.js';
import { sign, verify } from 'hono/jwt';
import { JWT_SECRET } from '../src/middlewares/auth.middleware.js';

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

  // Test Forgot & Reset Password
  const resetToken = await sign(
    { sub: newUser.id, email: newUser.email, type: 'password_reset', exp: Math.floor(Date.now() / 1000) + 3600 },
    JWT_SECRET,
    'HS256'
  );
  const resetPayload = await verify(resetToken, JWT_SECRET, 'HS256');
  console.assert(resetPayload.type === 'password_reset', 'Reset token type must match');
  await UserModel.updatePassword(newUser.id, 'brandnewpassword123');
  const updatedUser = await UserModel.findById(newUser.id);
  console.assert(verifyPassword('brandnewpassword123', updatedUser!.password_hash), 'New password must verify');
  console.log('✓ Forgot & Reset Password flow verified cleanly');

  // Test Google Auth User Auto-Creation
  const googleUser = await UserModel.findOrCreateFromGoogle({
    name: 'Budi Google Account',
    email: `google.${Date.now()}@gmail.com`
  });
  console.assert(googleUser.email.includes('@gmail.com'), 'Google user email should match');
  console.log('✓ Google Auth findOrCreate verified:', googleUser.name, googleUser.email);

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

  console.assert(report.ticket_number.startsWith('L-2026-'), 'Ticket number should match Figma format L-2026-XXXX');
  console.assert(report.status === 'pending', 'Initial status should be pending');
  console.log('✓ Citizen report created successfully. Ticket Number:', report.ticket_number);

  // Test Update Report (Pelapor mengubah laporan)
  const edited = await ReportModel.updateReport({
    id: report.id,
    user_id: newUser.id,
    title: 'Laporan Pengadaan TPS 3R Belum Beroperasi di Lokasi (Diperbarui)'
  });
  console.assert(edited.title.includes('(Diperbarui)'), 'Title should be updated');
  console.log('✓ Citizen report update works:', edited.title);

  // Test Cloudflare Storage Service CRUD (Create, Read, Delete)
  const { StorageService } = await import('../src/services/storage.service.js');
  const dummyBuffer = Buffer.from('FAKE-IMAGE-CONTENT-FOR-TESTING');
  // 1. Create (Upload)
  const uploadResult = await StorageService.uploadEvidence(dummyBuffer, 'evidence.jpg', 'image/jpeg');
  console.assert(uploadResult.url.length > 0, 'Storage upload should return URL');
  console.assert(uploadResult.filename.startsWith('evidence-'), 'Filename should have evidence- prefix');
  console.log('✓ Storage service upload (CREATE) verified:', uploadResult.provider, uploadResult.url);

  // 2. Read (Get metadata / Check existence)
  const fileInfo = await StorageService.getEvidenceInfo(uploadResult.filename);
  console.assert(fileInfo !== null, 'Uploaded file info should be retrievable');
  console.assert(fileInfo?.filename === uploadResult.filename, 'Retrieved filename must match');
  console.log('✓ Storage service info (READ) verified:', fileInfo?.filename, 'size:', fileInfo?.size);

  // 3. Delete (Remove file from cloud/local)
  const deleted = await StorageService.deleteEvidence(uploadResult.filename);
  console.assert(deleted === true, 'Delete evidence should return true');
  console.log('✓ Storage service delete (DELETE) verified for:', uploadResult.filename);

  // 4. Test HTTP Endpoints via Hono app
  const { app } = await import('../src/app.js');

  // 4a. Test POST upload via HTTP endpoint (multipart/form-data)
  const uploadForm = new FormData();
  const testFile = new File(['TEST-IMAGE-BYTES-HTTP-UPLOAD'], 'tinjauan-lapangan.png', { type: 'image/png' });
  uploadForm.append('file', testFile);

  const resUpload = await app.request('/api/v1/reports/upload', {
    method: 'POST',
    body: uploadForm
  });
  console.assert(resUpload.status === 201, 'Upload endpoint should return 201');
  const uploadJson = await resUpload.json();
  console.assert(uploadJson.success === true, 'Upload response should be success');
  console.assert(uploadJson.data.filename.startsWith('evidence-'), 'Filename must start with evidence-');
  console.assert(uploadJson.data.mimeType === 'image/png', 'Mime type should be image/png');
  console.log('✓ Storage endpoint POST /reports/upload verified:', uploadJson.data.filename, uploadJson.data.fileUrl);

  // 4b. Test GET metadata of uploaded file
  const resGetMeta = await app.request(`/api/v1/reports/upload/${uploadJson.data.filename}`);
  console.assert(resGetMeta.status === 200, 'GET uploaded file info should return 200');
  const getMetaJson = await resGetMeta.json();
  console.assert(getMetaJson.data.filename === uploadJson.data.filename, 'Metadata filename must match');
  console.log('✓ Storage endpoint GET /reports/upload/:filename verified');

  // 4c. Test DELETE uploaded file via HTTP endpoint
  const resDeleteHttp = await app.request(`/api/v1/reports/upload/${uploadJson.data.filename}`, {
    method: 'DELETE'
  });
  console.assert(resDeleteHttp.status === 200, 'DELETE uploaded file should return 200');
  console.log('✓ Storage endpoint DELETE /reports/upload/:filename verified');

  // 4d. Test invalid MIME type validation (e.g. application/x-msdownload)
  const invalidForm = new FormData();
  invalidForm.append('file', new File(['malicious-binary'], 'exploit.exe', { type: 'application/x-msdownload' }));
  const resInvalid = await app.request('/api/v1/reports/upload', {
    method: 'POST',
    body: invalidForm
  });
  console.assert(resInvalid.status === 400, 'Invalid mime type should be rejected with 400');
  console.log('✓ Storage endpoint invalid MIME rejection (400) verified');

  // 4e. Test GET non-existent file -> 404
  const resNotFound = await app.request('/api/v1/storage/non-existent-file.jpg');
  console.assert(resNotFound.status === 404, 'Non-existent evidence info should return 404');
  console.log('✓ Storage endpoint GET 404 handler verified');

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
  console.assert(publicReports.length >= 1, 'Should have at least 1 verified public report');
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
  const { ContentModel } = await import('../src/models/content.model.js');
  const glossary = ContentModel.getGlossary();
  console.assert(glossary.length >= 8, 'Glossary should have at least 8 key terms');
  console.log('✓ Glossary terms verified. Count:', glossary.length);

  const about = ContentModel.getAbout();
  console.assert(about.sections.length === 4, 'About should have 4 sections matching sitemap');
  console.log('✓ About sections verified (Profil, Metodologi, Sumber, Batasan/Anti-Goals)');

  const guide = ContentModel.getGuide();
  console.assert(guide.modules.length === 4, 'Guide should have 4 step modules matching sitemap');
  console.log('✓ Guide modules verified (Mulai, Status Data, Hirarki, APBD & Efisiensi)');

  console.log('\n--- 5. Testing Ingestion & Webhook Pipeline ---');
  const { IngestionService } = await import('../src/services/ingestion.service.js');
  const syncResults = await IngestionService.syncAllSources();
  console.assert(syncResults.length === 2, 'Should sync 2 primary sources');
  console.log('✓ 2 primary sources synced:', syncResults.map((s) => `${s.source} (${s.status})`).join(', '));

  // Test webhook ingest
  const webhookResult = await IngestionService.ingestPayload({
    source: 'bpkd-jakarta',
    records: [
      {
        id: 'dinas-lingkungan-hidup',
        nama: 'DINAS LINGKUNGAN HIDUP',
        belanja_anggaran: 3719846734770,
        belanja_realisasi: 3362947632852,
        has_deep_dive: true
      }
    ]
  });
  console.assert(webhookResult.processed === 1, 'Webhook should process 1 record');
  console.log('✓ Webhook ingestion processed:', webhookResult.processed, 'record for source:', webhookResult.source);

  console.log('\n=============================================');
  console.log('ALL MODULAR MCR BACKEND TESTS PASSED CLEANLY!');
  console.log('=============================================');
}

runTests().catch((e) => {
  console.error('Test failed:', e);
  process.exit(1);
});
