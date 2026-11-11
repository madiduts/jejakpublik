import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Ico } from '../detail/icons';

export interface SearchOption {
  value: string;
  hint?: string;
  badge?: string;
  keywords?: string;
}

export interface SearchGroup {
  label: string;
  items: SearchOption[];
}

interface Props {
  id: string;
  value: string;
  groups: SearchGroup[];
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  ariaLabel?: string;
}

/**
 * Pemilih dengan pencarian: tombol membuka panel ke bawah berisi kotak cari dan
 * daftar pilihan bergrup. Dipakai untuk memilih baris laporan tanpa mengetik
 * teks bebas, sehingga rujukan tetap konsisten dengan data yang ada.
 */
export const SearchSelect: React.FC<Props> = ({
  id, value, groups, onChange, placeholder, searchPlaceholder = 'Cari instansi atau program…', ariaLabel,
}) => {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const closeTimer = useRef<number | null>(null);

  const close = (refocus = true) => {
    if (!open) return;
    setClosing(true);
    closeTimer.current = window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
      setQuery('');
      if (refocus) btnRef.current?.focus();
    }, 120);
  };

  useEffect(() => () => { if (closeTimer.current) window.clearTimeout(closeTimer.current); }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) close(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  });

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((g) => ({
        label: g.label,
        items: g.items.filter((it) =>
          `${it.value} ${it.hint ?? ''} ${it.keywords ?? ''}`.toLowerCase().includes(q),
        ),
      }))
      .filter((g) => g.items.length > 0);
  }, [groups, query]);

  const flat = useMemo(() => filtered.flatMap((g) => g.items), [filtered]);

  useEffect(() => { setActive(0); }, [query]);

  const choose = (v: string) => {
    onChange(v);
    close();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => Math.min(flat.length - 1, i + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(0, i - 1)); }
    else if (e.key === 'Enter') {
      if (flat[active]) { e.preventDefault(); choose(flat[active].value); }
    }
  };

  let cursor = -1;

  return (
    <div className="cf-selectwrap" ref={wrapRef}>
      <button
        type="button"
        id={id}
        ref={btnRef}
        className="cf-selectbtn cf-target-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-menu`}
        aria-label={ariaLabel}
        onClick={() => (open ? close() : setOpen(true))}
      >
        <span className="cf-target-value">{value || placeholder}</span>
        <Ico g="chevdown" slot={14} color="currentColor" />
      </button>

      {open && (
        <div
          className="cf-menu cf-menu-search"
          id={`${id}-menu`}
          role="listbox"
          data-closing={closing ? 'true' : 'false'}
          onKeyDown={onKeyDown}
        >
          <div className="cf-searchwrap">
            <Ico g="search" slot={15} color="#71717A" />
            <input
              ref={inputRef}
              className="cf-searchinput"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              aria-label="Cari pilihan"
              aria-controls={`${id}-list`}
            />
            {query !== '' && (
              <button
                type="button"
                className="cf-searchclear"
                onClick={() => { setQuery(''); inputRef.current?.focus(); }}
                aria-label="Kosongkan pencarian"
              >
                ×
              </button>
            )}
          </div>

          <div id={`${id}-list`} className="cf-optlist">
            {filtered.length === 0 && (
              <p className="cf-optempty">Tidak ada yang cocok dengan “{query}”.</p>
            )}
            {filtered.map((g) => (
              <div key={g.label} className="cf-optgroup">
                <p className="cf-optgroup-h">{g.label}</p>
                {g.items.map((it) => {
                  cursor += 1;
                  const isActive = cursor === active;
                  return (
                    <button
                      key={`${g.label}-${it.value}`}
                      type="button"
                      role="option"
                      aria-selected={it.value === value}
                      data-active={isActive ? 'true' : 'false'}
                      className="cf-opt cf-opt-rich"
                      onMouseEnter={() => setActive(cursor)}
                      onClick={() => choose(it.value)}
                    >
                      <span className="cf-opttext">
                        <span className="cf-optlabel">{it.value}</span>
                        {it.hint && <span className="cf-opthint">{it.hint}</span>}
                      </span>
                      {it.badge && <span className="cf-optbadge">{it.badge}</span>}
                      {it.value === value && !it.badge && (
                        <span className="cf-tick" aria-hidden="true">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
