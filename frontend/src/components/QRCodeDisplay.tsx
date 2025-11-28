import { QRCodeData } from '../App';
import './QRCodeDisplay.css';

interface QRCodeDisplayProps {
  qrCode: QRCodeData;
}

export default function QRCodeDisplay({ qrCode }: QRCodeDisplayProps) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrCode.qrCode;
    link.download = `qr-code-${qrCode.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyShareUrl = () => {
    navigator.clipboard.writeText(qrCode.shareUrl);
    alert('Share URL copied to clipboard!');
  };

  return (
    <div className="qr-display">
      <h2>Generated QR Code</h2>
      
      <div className="qr-image-container">
        <img src={qrCode.qrCode} alt="QR Code" className="qr-image" />
      </div>

      <div className="qr-info">
        <div className="info-item">
          <strong>URL:</strong>
          <a href={qrCode.url} target="_blank" rel="noopener noreferrer">
            {qrCode.url}
          </a>
        </div>
        
        <div className="info-item">
          <strong>Style:</strong>
          <span className="style-badge">{qrCode.style}</span>
        </div>

        <div className="info-item">
          <strong>Share URL:</strong>
          <div className="share-url-container">
            <code>{qrCode.shareUrl}</code>
            <button onClick={handleCopyShareUrl} className="copy-button">
              Copy
            </button>
          </div>
        </div>
      </div>

      <div className="qr-actions">
        <button onClick={handleDownload} className="download-button">
          Download High Quality
        </button>
      </div>
    </div>
  );
}

