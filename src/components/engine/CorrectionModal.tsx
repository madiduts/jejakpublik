import React from 'react';
import { AlertTriangle, X, CheckCircle } from 'lucide-react';

interface CorrectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  printedValue: string;
  sourceDoc: string;
  sourceTable: string;
  verifiedValue: string;
  verificationSource: string;
  reason: string;
}

export const CorrectionModal: React.FC<CorrectionModalProps> = ({
  isOpen,
  onClose,
  title,
  printedValue,
  sourceDoc,
  sourceTable,
  verifiedValue,
  verificationSource,
  reason,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={20} color="var(--warn)" />
            <h3>Riwayat Koreksi Data Resmi</h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 0,
              cursor: 'pointer',
              color: 'var(--muted)',
              padding: '4px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: '14px' }}>
            {title}
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: '8px',
                padding: '12px',
              }}
            >
              <div style={{ fontSize: '11.5px', color: '#991B1B', fontWeight: 600, marginBottom: '4px' }}>
                TERCETAK DI DOKUMEN SUMBER
              </div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#B91C1C' }}>
                {printedValue}
              </div>
              <div style={{ fontSize: '11.5px', color: '#7F1D1D', marginTop: '4px' }}>
                {sourceDoc} ({sourceTable})
              </div>
            </div>

            <div
              style={{
                background: '#F0FDF4',
                border: '1px solid #BBF7D0',
                borderRadius: '8px',
                padding: '12px',
              }}
            >
              <div style={{ fontSize: '11.5px', color: '#166534', fontWeight: 600, marginBottom: '4px' }}>
                NILAI TERVERIFIKASI & DITAMPILKAN
              </div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#15803D' }}>
                {verifiedValue}
              </div>
              <div style={{ fontSize: '11.5px', color: '#14532D', marginTop: '4px' }}>
                {verificationSource}
              </div>
            </div>
          </div>

          <div
            style={{
              background: 'var(--warn-bg)',
              border: '1px solid var(--warn-line)',
              borderRadius: '8px',
              padding: '14px',
              fontSize: '13px',
              color: '#78350F',
            }}
          >
            <strong style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <CheckCircle size={16} color="var(--warn)" />
              Metodologi Penyelesaian & Rekonsiliasi:
            </strong>
            <p>{reason}</p>
          </div>
        </div>

        <div className="modal-foot">
          <button
            onClick={onClose}
            style={{
              background: 'var(--accent)',
              color: '#FFFFFF',
              border: 0,
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '13.5px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
