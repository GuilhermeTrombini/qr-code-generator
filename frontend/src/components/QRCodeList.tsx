import { QRCodeData } from '../App';
import './QRCodeList.css';

interface QRCodeListProps {
  qrCodes: QRCodeData[];
}

export default function QRCodeList({ qrCodes }: QRCodeListProps) {
  if (qrCodes.length === 0) {
    return (
      <div className="qr-list">
        <h2>Recent QR Codes</h2>
        <p className="empty-message">No QR codes generated yet. Create one above!</p>
      </div>
    );
  }

  return (
    <div className="qr-list">
      <h2>Recent QR Codes</h2>
      <div className="qr-list-grid">
        {qrCodes.map((qr) => (
          <div key={qr.id} className="qr-list-item">
            <div className="qr-list-item-header">
              <span className="qr-list-item-style">{qr.style}</span>
              {qr.accessCount !== undefined && (
                <span className="qr-list-item-count">{qr.accessCount} scans</span>
              )}
            </div>
            <div className="qr-list-item-url" title={qr.url}>
              {qr.url.length > 50 ? `${qr.url.substring(0, 50)}...` : qr.url}
            </div>
            <div className="qr-list-item-actions">
              <a
                href={qr.shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="qr-list-item-link"
              >
                View
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

