import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../database';
import { generateQRCode, applyStyle } from '../services/qrGenerator';
import { CreateQRCodeSchema, CreateQRCodeInput } from '../models/qrCode';

export const qrRoutes = Router();

// Preview QR code (doesn't save to database)
qrRoutes.post('/preview', async (req, res) => {
  try {
    const validated = CreateQRCodeSchema.parse(req.body);
    const input: CreateQRCodeInput = validated;

    // Generate QR code (use smaller size for preview to be faster)
    const previewSize = Math.min(input.size, 400); // Limit preview size for performance
    
    const qrBuffer = await generateQRCode(input.url, {
      errorCorrectionLevel: input.errorCorrectionLevel,
      margin: input.margin,
      color: input.color || '#000000',
      backgroundColor: input.backgroundColor || '#FFFFFF',
      width: previewSize,
    });

    // Apply style
    const styledBuffer = await applyStyle(qrBuffer, input.style, previewSize);

    // Convert buffer to base64 for response
    const base64Image = styledBuffer.toString('base64');
    const dataUrl = `data:image/png;base64,${base64Image}`;

    res.json({
      qrCode: dataUrl,
      preview: true,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Create QR code
qrRoutes.post('/create', async (req, res) => {
  try {
    const validated = CreateQRCodeSchema.parse(req.body);
    const input: CreateQRCodeInput = validated;

    const id = uuidv4();
    const db = getDatabase();

    // Generate QR code
    const qrBuffer = await generateQRCode(input.url, {
      errorCorrectionLevel: input.errorCorrectionLevel,
      margin: input.margin,
      color: input.color || '#000000',
      backgroundColor: input.backgroundColor || '#FFFFFF',
      width: input.size,
    });

    // Apply style
    const styledBuffer = await applyStyle(qrBuffer, input.style, input.size);

    // Store in database
    db.prepare(`
      INSERT INTO qr_codes (
        id, original_url, style, color, background_color,
        error_correction_level, margin, size
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      input.url,
      input.style,
      input.color || null,
      input.backgroundColor || null,
      input.errorCorrectionLevel,
      input.margin,
      input.size
    );

    // Convert buffer to base64 for response
    const base64Image = styledBuffer.toString('base64');
    const dataUrl = `data:image/png;base64,${base64Image}`;

    res.json({
      id,
      qrCode: dataUrl,
      url: input.url,
      style: input.style,
      shareUrl: `${req.protocol}://${req.get('host')}/${id}`,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Get QR code by ID
qrRoutes.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();

    const record = db.prepare('SELECT * FROM qr_codes WHERE id = ?').get(id) as any;

    if (!record) {
      return res.status(404).json({ error: 'QR code not found' });
    }

    // Regenerate QR code
    const qrBuffer = await generateQRCode(record.original_url, {
      errorCorrectionLevel: record.error_correction_level,
      margin: record.margin,
      color: record.color || '#000000',
      backgroundColor: record.background_color || '#FFFFFF',
      width: record.size,
    });

    const styledBuffer = await applyStyle(qrBuffer, record.style as any, record.size);
    const base64Image = styledBuffer.toString('base64');
    const dataUrl = `data:image/png;base64,${base64Image}`;

    res.json({
      id: record.id,
      qrCode: dataUrl,
      url: record.original_url,
      style: record.style,
      accessCount: record.access_count,
      createdAt: record.created_at,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all QR codes (for dashboard)
qrRoutes.get('/', async (req, res) => {
  try {
    const db = getDatabase();
    const records = db.prepare('SELECT * FROM qr_codes ORDER BY created_at DESC LIMIT 100').all() as any[];

    res.json(records.map(record => ({
      id: record.id,
      url: record.original_url,
      style: record.style,
      accessCount: record.access_count,
      createdAt: record.created_at,
      shareUrl: `${req.protocol}://${req.get('host')}/${record.id}`,
    })));
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

