import { z } from 'zod';

export const QRCodeStyleSchema = z.enum(['square', 'rounded', 'dots', 'classic']);
export type QRCodeStyle = z.infer<typeof QRCodeStyleSchema>;

export const CreateQRCodeSchema = z.object({
  url: z.string().url('Invalid URL format'),
  style: QRCodeStyleSchema.default('square'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color').optional(),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Background color must be a valid hex color').optional(),
  errorCorrectionLevel: z.enum(['L', 'M', 'Q', 'H']).default('M'),
  margin: z.number().int().min(0).max(10).default(4),
  size: z.number().int().min(100).max(2000).default(512),
});

export type CreateQRCodeInput = z.infer<typeof CreateQRCodeSchema>;

export interface QRCodeRecord {
  id: string;
  original_url: string;
  style: string;
  color: string | null;
  background_color: string | null;
  error_correction_level: string;
  margin: number;
  size: number;
  created_at: string;
  access_count: number;
}

