import { S3Client, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOCAL_UPLOAD_DIR = path.resolve(__dirname, '../../uploads');

if (!fs.existsSync(LOCAL_UPLOAD_DIR)) {
  fs.mkdirSync(LOCAL_UPLOAD_DIR, { recursive: true });
}

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
  provider: 'cloudflare-r2' | 'local-fallback';
}

export class StorageService {
  private static r2Client: S3Client | null = null;

  private static isR2Configured(): boolean {
    const accountId = (process.env.CLOUDFLARE_R2_ACCOUNT_ID || '').trim();
    const accessKey = (process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '').trim();
    const secretKey = (process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '').trim();
    const bucket = (process.env.CLOUDFLARE_R2_BUCKET_NAME || '').trim();

    return Boolean(
      accountId &&
        accessKey &&
        secretKey &&
        bucket &&
        !accountId.includes('placeholder')
    );
  }

  private static getR2Client(): S3Client {
    if (!this.r2Client) {
      const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID!.trim();
      this.r2Client = new S3Client({
        region: 'auto',
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!.trim(),
          secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!.trim()
        },
        forcePathStyle: true
      });
    }
    return this.r2Client;
  }

  /**
   * Upload berkas bukti gambar / foto dokumen laporan warga
   */
  static async uploadEvidence(
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string
  ): Promise<UploadResult> {
    const ext = path.extname(originalName) || (mimeType === 'application/pdf' ? '.pdf' : '.png');
    const filename = `evidence-${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`;
    const size = fileBuffer.length;

    // 1. Jika kredensial Cloudflare R2 telah diset pada .env
    if (this.isR2Configured()) {
      try {
        const client = this.getR2Client();
        const bucket = process.env.CLOUDFLARE_R2_BUCKET_NAME!;
        const publicBaseUrl = (process.env.CLOUDFLARE_R2_PUBLIC_URL || '').replace(/\/$/, '');

        await client.send(
          new PutObjectCommand({
            Bucket: bucket,
            Key: filename,
            Body: fileBuffer,
            ContentType: mimeType
          })
        );

        const url = publicBaseUrl ? `${publicBaseUrl}/${filename}` : `https://${bucket}.r2.dev/${filename}`;

        return {
          url,
          filename,
          size,
          mimeType,
          provider: 'cloudflare-r2'
        };
      } catch (err: any) {
        console.warn('Cloudflare R2 upload gagal, beralih ke penyimpanan lokal:', err.message);
      }
    }

    // 2. Fallback penyimpanan lokal
    const localPath = path.join(LOCAL_UPLOAD_DIR, filename);
    await fs.promises.writeFile(localPath, fileBuffer);
    const url = `/uploads/${filename}`;

    return {
      url,
      filename,
      size,
      mimeType,
      provider: 'local-fallback'
    };
  }

  /**
   * Sanitasi nama berkas untuk mencegah directory traversal
   */
  static sanitizeFilename(raw: string): string {
    return path.basename(raw).replace(/[^a-zA-Z0-9._-]/g, '_');
  }

  /**
   * 2. READ: Periksa keberadaan berkas bukti dan ambil metadata
   */
  static async getEvidenceInfo(filename: string): Promise<UploadResult | null> {
    const safeName = this.sanitizeFilename(filename);

    // Cek Cloudflare R2 jika terkonfigurasi
    if (this.isR2Configured()) {
      try {
        const client = this.getR2Client();
        const bucket = process.env.CLOUDFLARE_R2_BUCKET_NAME!;
        const publicBaseUrl = (process.env.CLOUDFLARE_R2_PUBLIC_URL || '').replace(/\/$/, '');

        const meta = await client.send(
          new HeadObjectCommand({
            Bucket: bucket,
            Key: safeName
          })
        );

        return {
          url: publicBaseUrl ? `${publicBaseUrl}/${safeName}` : `https://${bucket}.r2.dev/${safeName}`,
          filename: safeName,
          size: meta.ContentLength || 0,
          mimeType: meta.ContentType || 'image/jpeg',
          provider: 'cloudflare-r2'
        };
      } catch {
        // Lanjut ke pengecekan penyimpanan lokal
      }
    }

    // Cek penyimpanan lokal
    const localPath = path.join(LOCAL_UPLOAD_DIR, safeName);
    if (fs.existsSync(localPath)) {
      const stat = await fs.promises.stat(localPath);
      const ext = path.extname(safeName).toLowerCase();
      let mimeType = 'image/jpeg';
      if (ext === '.png') mimeType = 'image/png';
      else if (ext === '.webp') mimeType = 'image/webp';
      else if (ext === '.pdf') mimeType = 'application/pdf';

      return {
        url: `/uploads/${safeName}`,
        filename: safeName,
        size: stat.size,
        mimeType,
        provider: 'local-fallback'
      };
    }

    return null;
  }

  /**
   * 3. DELETE: Hapus berkas bukti dari Cloudflare R2 dan/atau disk lokal
   */
  static async deleteEvidence(filename: string): Promise<boolean> {
    const safeName = this.sanitizeFilename(filename);
    let deleted = false;

    // Hapus dari Cloudflare R2
    if (this.isR2Configured()) {
      try {
        const client = this.getR2Client();
        const bucket = process.env.CLOUDFLARE_R2_BUCKET_NAME!;
        await client.send(
          new DeleteObjectCommand({
            Bucket: bucket,
            Key: safeName
          })
        );
        deleted = true;
      } catch (err: any) {
        console.warn('Gagal menghapus objek di Cloudflare R2:', err.message);
      }
    }

    // Hapus dari disk lokal jika berkas ada
    const localPath = path.join(LOCAL_UPLOAD_DIR, safeName);
    if (fs.existsSync(localPath)) {
      try {
        await fs.promises.unlink(localPath);
        deleted = true;
      } catch (err: any) {
        console.warn('Gagal menghapus berkas lokal:', err.message);
      }
    }

    return deleted;
  }

  /**
   * Helper DELETE dari URL berkas lengkap (misal: /uploads/evidence-xxx.jpg)
   */
  static async deleteEvidenceByUrl(urlOrPath: string): Promise<boolean> {
    if (!urlOrPath) return false;
    const clean = urlOrPath.split('?')[0];
    const filename = path.basename(clean);
    return this.deleteEvidence(filename);
  }
}
