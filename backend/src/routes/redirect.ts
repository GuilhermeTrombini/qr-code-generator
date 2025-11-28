import { Router } from 'express';
import { getDatabase } from '../database';

export const redirectRoutes = Router();

// UUID pattern for QR code IDs
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Redirect endpoint - when QR code is scanned
redirectRoutes.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  
  // Only process if it looks like a UUID
  if (!UUID_PATTERN.test(id)) {
    return next();
  }
  
  try {
    const db = getDatabase();

    const record = db.prepare('SELECT * FROM qr_codes WHERE id = ?').get(id) as any;

    if (!record) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>QR Code Not Found</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            </style>
          </head>
          <body>
            <h1>QR Code Not Found</h1>
            <p>The QR code you're looking for doesn't exist.</p>
          </body>
        </html>
      `);
    }

    // Increment access count
    db.prepare('UPDATE qr_codes SET access_count = access_count + 1 WHERE id = ?').run(id);

    // Redirect to original URL
    res.redirect(301, record.original_url);
  } catch (error) {
    res.status(500).send('Internal server error');
  }
});

