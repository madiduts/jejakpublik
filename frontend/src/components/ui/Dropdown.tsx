import React, { useEffect, useRef, useState } from 'react';
import { Ico } from '../detail/icons';

interface Props {
  id: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  ariaLabel?: string;
}

/**
 * Dropdown ringkas dengan gaya menu yang sama seperti saringan di Jelajahi
 * (.ex-menu): panel putih bergaris, opsi dengan tanda centang, dan animasi
 * buka-tutup. Memakai listbox supaya navigasi papan ketik tetap benar.
 */
export const Dropdown: React.FC<Props> = ({ id, value, options, onChange, ariaLabel }) => {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [active, setActive] = useState(() => Math.max(0, options.indexOf(value)));
  const wrapRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<number | null>(null);

  const close = () => {
    if (!open) return;
    setClosing(true);
    closeTimer.current = window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
      btnRef.current?.focus();
    }, 120);
  };

  useEffect(() => () => { if (closeTimer.current) window.clearTimeout(closeTimer.current); }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) close();
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  });

  useEffect(() => {
    if (open) setActive(Math.max(0, options.indexOf(value)));
  }, [open, options, value]);

  const choose = (v: string) => {
    onChange(v);
    close();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => (i + 1) % options.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => (i - 1 + options.length) % options.length); }
    else if (e.key === 'Home') { e.preventDefault(); setActive(0); }
    else if (e.key === 'End') { e.preventDefault(); setActive(options.length - 1); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(options[active]); }
  };

  return (
    <div className="cf-selectwrap" ref={wrapRef}>
      <button
        type="button"
        id={id}
        ref={btnRef}
        className="cf-selectbtn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-menu`}
        aria-label={ariaLabel}
        onClick={() => (open ? close() : setOpen(true))}
        onKeyDown={onKeyDown}
      >
        <span>{value}</span>
        <Ico g="chevdown" slot={14} color="currentColor" />
      </button>

      {open && (
        <div
          className="cf-menu"
          id={`${id}-menu`}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={id}
          data-closing={closing ? 'true' : 'false'}
          onKeyDown={onKeyDown}
        >
          {options.map((o, i) => (
            <button
              key={o}
              type="button"
              role="option"
              aria-selected={o === value}
              data-active={i === active ? 'true' : 'false'}
              className="cf-opt"
              onMouseEnter={() => setActive(i)}
              onClick={() => choose(o)}
            >
              <span>{o}</span>
              {o === value && <span className="cf-tick" aria-hidden="true">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
