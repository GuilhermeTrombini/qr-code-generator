import QRCode from 'qrcode';
import sharp from 'sharp';
import { QRCodeStyle, CreateQRCodeInput } from '../models/qrCode';

export interface QRCodeOptions {
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  margin: number;
  color: string;
  backgroundColor: string;
  width: number;
}

export async function generateQRCode(
  url: string,
  options: QRCodeOptions
): Promise<Buffer> {
  const qrDataUrl = await QRCode.toDataURL(url, {
    errorCorrectionLevel: options.errorCorrectionLevel,
    margin: options.margin,
    color: {
      dark: options.color,
      light: options.backgroundColor,
    },
    width: options.width,
  });

  // Convert data URL to buffer
  const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, '');
  return Buffer.from(base64Data, 'base64');
}

export async function applyStyle(
  qrBuffer: Buffer,
  style: QRCodeStyle,
  size: number
): Promise<Buffer> {
  // For square style, just ensure it's the right size and return
  if (style === 'square') {
    return sharp(qrBuffer)
      .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .png()
      .toBuffer();
  }

  switch (style) {
    case 'rounded':
      return applyRoundedStyle(qrBuffer, size);
    case 'dots':
      return applyDotsStyle(qrBuffer, size);
    case 'classic':
      return applyClassicStyle(qrBuffer, size);
    default:
      return sharp(qrBuffer)
        .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
        .png()
        .toBuffer();
  }
}

async function applyRoundedStyle(buffer: Buffer, size: number): Promise<Buffer> {
  // Create rounded corners by applying a mask with rounded rectangle
  const qrImage = await sharp(buffer)
    .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toBuffer();

  // Create an SVG mask with rounded corners - more pronounced
  const cornerRadius = Math.max(20, Math.floor(size * 0.12)); // 12% of size, minimum 20px
  const maskSvg = Buffer.from(`
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" rx="${cornerRadius}" ry="${cornerRadius}" fill="white"/>
    </svg>
  `);

  const mask = await sharp(maskSvg)
    .resize(size, size)
    .png()
    .toBuffer();

  // Apply mask and add padding
  const result = await sharp(qrImage)
    .composite([{ input: mask, blend: 'dest-in' }])
    .extend({
      top: 40,
      bottom: 40,
      left: 40,
      right: 40,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .png()
    .toBuffer();

  return result;
}

async function applyDotsStyle(buffer: Buffer, size: number): Promise<Buffer> {
  // Create a dots effect by applying aggressive blur/sharpen to make modules appear circular
  const qrImage = await sharp(buffer)
    .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toBuffer();

  // Apply blur and sharpen to create a softer, more rounded appearance
  // This makes square modules appear more like circular dots
  const result = await sharp(qrImage)
    .blur(1.2)
    .sharpen({ sigma: 1.5, flat: 1, jagged: 2 })
    .extend({
      top: 30,
      bottom: 30,
      left: 30,
      right: 30,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .png()
    .toBuffer();

  return result;
}

async function applyClassicStyle(buffer: Buffer, size: number): Promise<Buffer> {
  // Classic style with prominent border and enhanced contrast
  const qrImage = await sharp(buffer)
    .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toBuffer();

  // Add a prominent white border and enhance contrast for a classic look
  const result = await sharp(qrImage)
    .extend({
      top: 50,
      bottom: 50,
      left: 50,
      right: 50,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .modulate({
      brightness: 1.15,
      saturation: 1.2,
    })
    .normalise()
    .png()
    .toBuffer();

  return result;
}

