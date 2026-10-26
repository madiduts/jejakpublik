import React, { useState } from 'react';
import { DataNumber } from '../engine/DataNumber';
import { formatRupiah, formatPersen } from '../../utils/format';
import { ProgramItem } from '../../types';
import { ChevronDown, ChevronRight, AlertTriangle } from 'lucide-react';

interface ProgramHierarchyProps {
  programs: ProgramItem[];
}

export const ProgramHierarchy: React.FC<ProgramHierarchyProps> = ({ programs }) => {
  // State for expanded programs and kegiatan
  const [expandedPrograms, setExpandedPrograms] = useState<Record<string, boolean>>({
    // Expand program B3 and first program by default for demonstration
    0: true,
    2: true,
  });

  const [expandedKegiatan, setExpandedKegiatan] = useState<Record<string, boolean>>({
    '0-0': true, // Program 1, Kegiatan 1 (Administrasi Keuangan - has held subkegiatan)
    '2-0': true, // Program B3, Kegiatan 1
  });

  const toggleProgram = (idx: number) => {
    setExpandedPrograms((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleKegiatan = (key: string) => {
    setExpandedKegiatan((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const expandAll = () => {
    const p: Record<string, boolean> = {};
    const k: Record<string, boolean> = {};
    programs.forEach((prog, pIdx) => {
      p[pIdx] = true;
      prog.kegiatan.forEach((_, kIdx) => {
        k[`${pIdx}-${kIdx}`] = true;
      });
    });
    setExpandedPrograms(p);
    setExpandedKegiatan(k);
  };

  const collapseAll = () => {
    setExpandedPrograms({});
    setExpandedKegiatan({});
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ink)' }}>
            Hierarki Belanja 8 Program, 15 Kegiatan, 33 Subkegiatan
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '2px' }}>
            Data bersumber dari LKIP DLH 2025 (Tabel 3.34) diverifikasi silang dengan Tabel 2.4 & Dashboard BPKD.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={expandAll}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid var(--line)',
              background: 'var(--surface)',
              fontSize: '12.5px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Buka Semua Rincian
          </button>
          <button
            type="button"
            onClick={collapseAll}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid var(--line)',
              background: 'var(--surface)',
              fontSize: '12.5px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Tutup Semua
          </button>
        </div>
      </div>

      {/* Program Cards */}
      {programs.map((prog, pIdx) => {
        const isExpanded = !!expandedPrograms[pIdx];
        const isB3Program = prog.program.includes('BAHAN BERBAHAYA DAN BERACUN (B3)');
        const apbdpNumber = prog.apbdp;
        const realisasiNumber = prog.realisasi;
        const pctNumber = apbdpNumber > 0 ? (realisasiNumber / apbdpNumber) * 100 : 0;

        return (
          <div key={pIdx} className="prog-card" style={isB3Program ? { borderColor: 'var(--warn-line)' } : {}}>
            {/* Program Header */}
            <div className="prog-head" style={isB3Program ? { background: '#FFFDF5' } : {}}>
              <div
                onClick={() => toggleProgram(pIdx)}
                style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', cursor: 'pointer', gap: '12px' }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span className="badge" style={{ fontSize: '11px', padding: '2px 8px' }}>
                      Program {pIdx + 1} dari 8
                    </span>
                    {isB3Program && (
                      <span className="badge badge-warn" style={{ fontSize: '11px', padding: '2px 8px' }}>
                        <AlertTriangle size={12} /> Angka Diperbaiki & Terverifikasi
                      </span>
                    )}
                  </div>
                  <h4 className="prog-title" style={{ fontSize: '16px', margin: 0 }}>
                    {prog.program}
                  </h4>
                </div>

                <button
                  type="button"
                  style={{
                    background: 'none',
                    border: '1px solid var(--line)',
                    borderRadius: '6px',
                    padding: '6px',
                    cursor: 'pointer',
                    color: 'var(--ink)',
                  }}
                  aria-label="Toggle program"
                >
                  {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </button>
              </div>

              {/* Numbers grid */}
              <div className="prog-nums" style={{ marginTop: '14px' }}>
                <div className="prog-num-box">
                  <span className="lbl">ANGGARAN PERUBAHAN (APBD-P)</span>
                  <div className="val">
                    {isB3Program ? (
                      <DataNumber
                        value={apbdpNumber}
                        state="dikoreksi"
                        title={prog.program}
                        originalValue={67876101084}
                        sourceDoc="LKIP DLH 2025"
                        sourceTable="Tabel 2.4"
                        verificationSource="LKIP Tabel 3.34 & Dashboard BPKD"
                        reason="Tabel 2.4 salah salin nilai APBD-P Rp67,87 Miliar dari program di atasnya. Nilai valid terkonfirmasi Rp3.684.567.176 sesuai rekonsiliasi total dokumen dan Dashboard BPKD."
                      />
                    ) : (
                      <DataNumber value={apbdpNumber} state="normal" />
                    )}
                  </div>
                </div>

                <div className="prog-num-box">
                  <span className="lbl">REALISASI BELANJA</span>
                  <div className="val">
                    <DataNumber value={realisasiNumber} state="normal" />
                  </div>
                </div>

                <div className="prog-num-box">
                  <span className="lbl">PERSENTASE TERSERAP</span>
                  <div className="val" style={{ color: pctNumber >= 85 ? 'var(--success)' : 'var(--warn)' }}>
                    {formatPersen(pctNumber)}
                  </div>
                </div>

                <div className="prog-num-box">
                  <span className="lbl">RINCIAN KEGIATAN</span>
                  <div className="val" style={{ fontSize: '14px', color: 'var(--muted)' }}>
                    {prog.kegiatan.length} Kegiatan ({prog.kegiatan.reduce((acc, k) => acc + k.sub_kegiatan.length, 0)} Subkegiatan)
                  </div>
                </div>
              </div>

              {/* Explanatory callout for B3 */}
              {isB3Program && (
                <div
                  style={{
                    marginTop: '12px',
                    background: 'var(--warn-bg)',
                    border: '1px solid var(--warn-line)',
                    borderRadius: '7px',
                    padding: '8px 12px',
                    fontSize: '12px',
                    color: '#78350F',
                  }}
                >
                  <strong>Temuan Audit Trail:</strong> Dokumen LKIP Tabel 2.4 mencetak angka Rp67.876.101.084 (duplikasi). 
                  JejakPublik menampilkan angka terkoreksi Rp3.684.567.176 yang terbukti cocok secara matematis dengan Tabel 3.34 dan total provinsi BPKD.
                </div>
              )}
            </div>

            {/* Kegiatan List (Collapsible) */}
            {isExpanded && (
              <div className="keg-list">
                {prog.kegiatan.map((keg, kIdx) => {
                  const kegKey = `${pIdx}-${kIdx}`;
                  const isKegExpanded = !!expandedKegiatan[kegKey];
                  const hasHeldSubkeg = keg.sub_kegiatan.some((s) => s.sub_kegiatan.includes('Gaji dan Tunjangan ASN'));

                  return (
                    <div key={kIdx} className="keg-item">
                      <div
                        className="keg-summary"
                        onClick={() => toggleKegiatan(kegKey)}
                        style={{ padding: '6px 0' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                          {isKegExpanded ? <ChevronDown size={16} color="var(--accent)" /> : <ChevronRight size={16} color="var(--muted)" />}
                          <div>
                            <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{keg.kegiatan}</span>
                            {hasHeldSubkeg && (
                              <span className="badge badge-hold" style={{ fontSize: '10.5px', marginLeft: '8px', padding: '1px 6px' }}>
                                Memuat Nilai Ditahan
                              </span>
                            )}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px' }}>
                          <span style={{ color: 'var(--muted)' }}>
                            APBD-P: {formatRupiah(keg.apbdp)}
                          </span>
                          <span style={{ fontWeight: 600, color: 'var(--ink)' }}>
                            Realisasi: {formatRupiah(keg.realisasi)}
                          </span>
                          <span className="badge" style={{ fontSize: '11.5px' }}>
                            {formatPersen(keg.pct)}
                          </span>
                        </div>
                      </div>

                      {/* Subkegiatan List */}
                      {isKegExpanded && (
                        <div className="subkeg-list">
                          {keg.sub_kegiatan.map((sub, sIdx) => {
                            const isGajiAsn = sub.sub_kegiatan.includes('Gaji dan Tunjangan ASN');

                            return (
                              <div key={sIdx} className="subkeg-item">
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontWeight: 500, color: 'var(--ink)' }}>
                                    {sub.sub_kegiatan}
                                  </div>
                                  {isGajiAsn && (
                                    <div style={{ fontSize: '11.5px', color: 'var(--muted)', marginTop: '2px' }}>
                                      Ketidakkonsistenan sumber: Nilai anak duplikat nilai induk kegiatan (selisih Rp138,16 Juta terhadap total subkegiatan).
                                    </div>
                                  )}
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px' }}>
                                  <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '11px', color: 'var(--muted)' }}>APBD-P</div>
                                    {isGajiAsn ? (
                                      <DataNumber value={null} state="ditahan" />
                                    ) : (
                                      <DataNumber value={sub.apbdp} state="normal" />
                                    )}
                                  </div>

                                  <div style={{ textAlign: 'right', minWidth: '130px' }}>
                                    <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Realisasi</div>
                                    {isGajiAsn ? (
                                      <DataNumber value={null} state="ditahan" />
                                    ) : (
                                      <DataNumber value={sub.realisasi} state="normal" />
                                    )}
                                  </div>

                                  <div style={{ minWidth: '60px', textAlign: 'right' }}>
                                    <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Serapan</div>
                                    {isGajiAsn ? (
                                      <span style={{ color: 'var(--muted)', fontStyle: 'italic', fontSize: '12px' }}>
                                        Tertahan
                                      </span>
                                    ) : (
                                      <span style={{ fontWeight: 600 }}>{formatPersen(sub.pct)}</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
