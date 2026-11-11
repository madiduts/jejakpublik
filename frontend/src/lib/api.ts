/**
 * Alamat backend opsional, diisi lewat VITE_API_BASE saat build.
 *
 * Kosong berarti situs dijalankan sebagai prototipe statis: semua permintaan
 * ke backend dilewati dan aplikasi memakai penyimpanan lokal. Ini yang dipakai
 * pada versi playable untuk penjurian, supaya tidak ada permintaan gagal ke
 * localhost di konsol peramban.
 */
export const API_BASE = (import.meta.env.VITE_API_BASE ?? '').replace(/\/$/, '');
export const adaBackend = API_BASE.length > 0;
