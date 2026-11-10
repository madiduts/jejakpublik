# Implementasi CRUD Storage & Upload Bukti Laporan Warga

Dokumen teknis implementasi siklus hidup berkas bukti pelaporan warga (Sitemap Jalur B) pada platform **JejakPublik**.

---

## 1. Arsitektur & Prinsip Desain

Pemisahan tanggung jawab mengikuti arsitektur berlapis:
- **Routing Layer (`src/routes/`):** Menangani routing pada `/api/v1/reports/upload` dan `/api/v1/storage`.
- **Controller Layer (`src/controllers/report.controller.ts`):** Validasi format berkas (MIME), batas ukuran payload, serta penataan kode status HTTP dan JSON response.
- **Service Layer (`src/services/storage.service.ts`):** Sanitasi nama berkas anti-traversal, integrasi AWS S3 SDK untuk Cloudflare R2, dan fallback ke disk lokal (`./uploads/`).

---

## 2. Kontrak Endpoint REST API

| Method | Endpoint | Fungsi | Akses |
|---|---|---|---|
| `POST` | `/api/v1/reports/upload` atau `/api/v1/storage/upload` | Upload 1 berkas bukti foto/dokumen | Publik |
| `GET` | `/api/v1/reports/upload/:filename` atau `/api/v1/storage/:filename` | Cek metadata & keberadaan berkas | Publik |
| `DELETE` | `/api/v1/reports/upload/:filename` atau `/api/v1/storage/:filename` | Hapus berkas dari R2 dan lokal | Publik |
| `GET` | `/uploads/:filename` | Penyajian berkas statis | Publik |

### Batasan Upload
- **Header:** `Content-Type: multipart/form-data`
- **Field Key:** `file` atau `image`
- **MIME Type:** `image/png`, `image/jpeg`, `image/jpg`, `image/webp`, `application/pdf`
- **Ukuran Maksimal:** 10 MB per berkas
- **Ukuran Minimal:** > 0 byte

---

## 3. Respon JSON Standar

### Upload Sukses (201 Created)
```json
{
  "success": true,
  "message": "Bukti dokumen/foto berhasil diunggah.",
  "data": {
    "filename": "evidence-1794320322113-f6ab3c08.png",
    "fileUrl": "https://pub-placeholder.r2.dev/evidence-1794320322113-f6ab3c08.png",
    "size": 31,
    "mimeType": "image/png",
    "provider": "cloudflare-r2"
  }
}
```

### Metadata Berkas (200 OK)
```json
{
  "success": true,
  "data": {
    "url": "https://pub-placeholder.r2.dev/evidence-1794320322113-f6ab3c08.png",
    "filename": "evidence-1794320322113-f6ab3c08.png",
    "size": 31,
    "mimeType": "image/png",
    "provider": "cloudflare-r2"
  }
}
```

### Hapus Berkas (200 OK)
```json
{
  "success": true,
  "message": "Berkas bukti berhasil dihapus."
}
```

---

## 4. Perubahan Berkas Kode

1. `backend/src/services/storage.service.ts`:
   - Tambah sanitasi `sanitizeFilename(raw)`.
   - Tambah `getEvidenceInfo(filename)` menggunakan `HeadObjectCommand` R2 & `fs.stat` lokal.
   - Tambah `deleteEvidence(filename)` menggunakan `DeleteObjectCommand` R2 & `fs.unlink` lokal.
   - Tambah `deleteEvidenceByUrl(urlOrPath)`.

2. `backend/src/controllers/report.controller.ts`:
   - Tambah handler `getEvidence` dan `deleteEvidence`.
   - Update `deleteReport`: otomatis menghapus semua file di `evidence_urls` saat laporan dihapus.

3. `backend/src/routes/report.routes.ts`:
   - Tambah rute `GET /upload/:filename` dan `DELETE /upload/:filename`.

4. `backend/src/routes/storage.routes.ts`:
   - Modul rute tersendiri `/api/v1/storage` untuk fleksibilitas konsumsi API.

5. `backend/src/app.ts`:
   - Mount `storageRoutes` pada `/api/v1/storage`.

6. `backend/tests/mcr.test.ts`:
   - Menambahkan pengujian integrasi HTTP: POST multipart, GET metadata, DELETE berkas, dan penolakan MIME non-gambar.

---

## 5. Verifikasi & Build

```bash
# Jalankan test integrasi backend
npm --prefix backend test

# Typecheck dan build backend
npm --prefix backend run build

# Build frontend
npm --prefix frontend run build
```
Semua perintah di atas berhasil lulus 100%.
