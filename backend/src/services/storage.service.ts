import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
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
}
