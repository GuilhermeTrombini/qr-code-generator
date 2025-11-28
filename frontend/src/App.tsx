import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import QRCodeForm from './components/QRCodeForm';
import QRCodeDisplay from './components/QRCodeDisplay';
import QRCodeList from './components/QRCodeList';

// Use environment variable if set, otherwise use relative path in production or localhost in dev
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? '/api' : 'http://localhost:3000/api');

export interface QRCodeData {
  id: string;
  qrCode: string;
  url: string;
  style: string;
  shareUrl: string;
  accessCount?: number;
  createdAt?: string;
}

function App() {
  const [qrCode, setQrCode] = useState<QRCodeData | null>(null);
  const [qrCodes, setQrCodes] = useState<QRCodeData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQRCodes();
  }, []);

  const loadQRCodes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/qr`);
      setQrCodes(response.data);
    } catch (err) {
      console.error('Failed to load QR codes:', err);
    }
  };

  const handleGenerate = async (formData: {
    url: string;
    style: string;
    color?: string;
    backgroundColor?: string;
    errorCorrectionLevel: string;
    margin: number;
    size: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/qr/create`, formData);
      setQrCode(response.data);
      await loadQRCodes();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>QR Code Generator</h1>
        <p>Create beautiful, customizable QR codes with instant redirects</p>
      </header>

      <main className="app-main">
        <div className="app-content">
          <div className="form-section">
            <QRCodeForm onSubmit={handleGenerate} loading={loading} />
            {error && <div className="error-message">{error}</div>}
          </div>

          {qrCode && (
            <div className="display-section">
              <QRCodeDisplay qrCode={qrCode} />
            </div>
          )}
        </div>

        <div className="list-section">
          <QRCodeList qrCodes={qrCodes} />
        </div>
      </main>
    </div>
  );
}

export default App;

