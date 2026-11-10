import React from 'react';

export type Glyph =
  | 'home' | 'chev' | 'pin' | 'globe' | 'phone' | 'search' | 'chevdown'
  | 'file' | 'chart' | 'link' | 'alert';

/** Path Lucide, sama dengan glyph yang dipakai frame (grid 24). */
const PATHS: Record<Glyph, React.ReactNode> = {
  home: (<><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>),
  chev: <path d="m9 18 6-6-6-6" />,
  pin: (<><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></>),
  globe: (<><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" /></>),
  phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />,
  search: (<><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>),
  chevdown: <path d="m6 9 6 6 6-6" />,
  file: (<><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v5h5" /><path d="M16 13H8" /><path d="M16 17H8" /></>),
  chart: (<><path d="M3 3v18h18" /><rect x="7" y="12" width="2.7" height="7.3" rx="1.35" /><rect x="12" y="8" width="2.7" height="11.3" rx="1.35" /><rect x="17" y="15" width="2.7" height="4.3" rx="1.35" /></>),
  link: (<><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></>),
  alert: (<><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></>),
};

/** Ikon frame memakai stroke 2 px di dalam slot, bukan 2 satuan grid 24. */
export const Ico: React.FC<{ g: Glyph; slot: number; id?: string; color?: string; className?: string }> = ({
  g, slot, id, color = '#52525C', className,
}) => (
  <svg
    data-node-id={id}
    className={className}
    width={slot}
    height={slot}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={(2 * 24) / slot}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    style={{ display: 'block', flex: 'none' }}
  >
    {PATHS[g]}
  </svg>
);
