import React from 'react';
import {
  AlertTriangle, BarChart3, Building2, ChevronDown, ChevronRight, FileText,
  Globe, Home, Link2, MapPin, Phone, Search,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type Glyph =
  | 'home' | 'chev' | 'pin' | 'globe' | 'phone' | 'search' | 'chevdown'
  | 'file' | 'chart' | 'link' | 'alert' | 'building';

const GLYPHS: Record<Glyph, LucideIcon> = {
  home: Home,
  chev: ChevronRight,
  pin: MapPin,
  globe: Globe,
  phone: Phone,
  search: Search,
  chevdown: ChevronDown,
  file: FileText,
  chart: BarChart3,
  link: Link2,
  alert: AlertTriangle,
  building: Building2,
};

/**
 * Semua ikon memakai komponen lucide-react.
 * Frame menaruh glyph di slot kecil dengan tebal garis 2 px, sedangkan Lucide
 * memakai grid 24, jadi strokeWidth dihitung `2 × 24 / slot`.
 */
export const Ico: React.FC<{
  g: Glyph;
  slot: number;
  id?: string;
  color?: string;
  className?: string;
}> = ({ g, slot, id, color = '#52525C', className }) => {
  const Cmp = GLYPHS[g];
  return (
    <Cmp
      data-node-id={id}
      className={className}
      size={slot}
      color={color}
      strokeWidth={48 / slot}
      absoluteStrokeWidth={false}
      aria-hidden="true"
      style={{ display: 'block', flex: 'none' }}
    />
  );
};
