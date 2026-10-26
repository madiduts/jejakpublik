import React, { useState } from 'react';
import { formatRupiah } from '../../utils/format';
import { AlertCircle, HelpCircle } from 'lucide-react';
import { CorrectionModal } from './CorrectionModal';

interface DataNumberProps {
  value: number | string | null | undefined;
  state?: 'normal' | 'dikoreksi' | 'ditahan';
  title?: string;
  sourceDoc?: string;
  sourceTable?: string;
  originalValue?: string | number;
  verificationSource?: string;
  reason?: string;
  className?: string;
  prefix?: string;
}

export const DataNumber: React.FC<DataNumberProps> = ({
  value,
  state = 'normal',
  title = 'Angka Anggaran',
  sourceDoc = 'LKIP 2025',
  sourceTable = 'Tabel 2.4',
  originalValue = '',
  verificationSource = 'Dashboard BPKD & Tabel 3.34',
  reason = 'Rekonsiliasi total penjumlahan internal',
  className = '',
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  if (state === 'ditahan') {
    return (
      <span
        className={`num-held ${className}`}
        title="Nilai ditahan karena terdapat ketidakkonsistenan hierarki pada dokumen sumber tanpa pembanding kedua."
      >
        <HelpCircle size={14} />
        Belum ditampilkan: menunggu klarifikasi sumber
      </span>
    );
  }

  if (state === 'dikoreksi') {
    return (
      <>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className={`num-corrected ${className}`}
          title="Klik untuk melihat bukti audit trail dan rekonsiliasi data"
        >
          <AlertCircle size={14} />
          {formatRupiah(value)}
          <span style={{ fontSize: '11px', textDecoration: 'underline', marginLeft: '2px' }}>
            [Dikoreksi]
          </span>
        </button>

        <CorrectionModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={title}
          printedValue={typeof originalValue === 'number' ? formatRupiah(originalValue) : originalValue}
          sourceDoc={sourceDoc}
          sourceTable={sourceTable}
          verifiedValue={formatRupiah(value)}
          verificationSource={verificationSource}
          reason={reason}
        />
      </>
    );
  }

  return <span className={`num-normal ${className}`}>{formatRupiah(value)}</span>;
};
