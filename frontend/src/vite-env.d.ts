/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** OAuth 2.0 Web Client ID untuk Google Identity Services. Kosong = tombol memberi keterangan. */
  readonly VITE_GOOGLE_CLIENT_ID?: string;
  /** Alamat backend laporan. Kosong = prototipe statis, tanpa permintaan ke localhost. */
  readonly VITE_API_BASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
