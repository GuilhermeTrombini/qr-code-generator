import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./QRCodeForm.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? "/api" : "http://localhost:3000/api");

interface QRCodeFormProps {
  onSubmit: (data: {
    url: string;
    style: string;
    color?: string;
    backgroundColor?: string;
    errorCorrectionLevel: string;
    margin: number;
    size: number;
  }) => void;
  loading: boolean;
}

export default function QRCodeForm({ onSubmit, loading }: QRCodeFormProps) {
  const [url, setUrl] = useState("");
  const [style, setStyle] = useState("square");
  const [color, setColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState("M");
  const [margin, setMargin] = useState(4);
  const [size, setSize] = useState(512);
  const [preview, setPreview] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  // URL validation helper
  const isValidUrl = (urlString: string): boolean => {
    try {
      const url = new URL(urlString);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  // Generate preview
  const generatePreview = useCallback(async () => {
    if (!url.trim() || !isValidUrl(url.trim())) {
      setPreview(null);
      setPreviewError(null);
      return;
    }

    setPreviewLoading(true);
    setPreviewError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/qr/preview`, {
        url: url.trim(),
        style,
        color,
        backgroundColor,
        errorCorrectionLevel,
        margin,
        size,
      });
      setPreview(response.data.qrCode);
    } catch (error: any) {
      setPreviewError(
        error.response?.data?.error || "Failed to generate preview"
      );
      setPreview(null);
    } finally {
      setPreviewLoading(false);
    }
  }, [url, style, color, backgroundColor, errorCorrectionLevel, margin, size]);

  // Update preview when form values change (with debounce)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      generatePreview();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [
    url,
    style,
    color,
    backgroundColor,
    errorCorrectionLevel,
    margin,
    size,
    generatePreview,
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      return;
    }
    onSubmit({
      url: url.trim(),
      style,
      color,
      backgroundColor,
      errorCorrectionLevel,
      margin,
      size,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="qr-form">
      <h2>Create QR Code</h2>

      <div className="form-group">
        <label htmlFor="url">URL *</label>
        <input
          type="url"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          required
          disabled={loading}
        />
      </div>

      {/* Preview Section */}
      <div className="preview-section">
        <h3>Preview</h3>
        {previewLoading && (
          <div className="preview-loading">Generating preview...</div>
        )}
        {previewError && <div className="preview-error">{previewError}</div>}
        {preview && !previewLoading && (
          <div className="preview-container">
            <img
              src={preview}
              alt="QR Code Preview"
              className="preview-image"
            />
            <p className="preview-note">
              This is a preview. Click "Generate QR Code" to create the final
              version.
            </p>
          </div>
        )}
        {!url.trim() && !previewLoading && (
          <div className="preview-placeholder">
            Enter a URL to see a preview
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="style">Style</label>
        <select
          id="style"
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          disabled={loading}
        >
          <option value="square">Square</option>
          <option value="rounded">Rounded</option>
          <option value="dots">Dots</option>
          <option value="classic">Classic</option>
        </select>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="color">Color</label>
          <input
            type="color"
            id="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="backgroundColor">Background Color</label>
          <input
            type="color"
            id="backgroundColor"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            disabled={loading}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="errorCorrectionLevel">Error Correction Level</label>
        <select
          id="errorCorrectionLevel"
          value={errorCorrectionLevel}
          onChange={(e) => setErrorCorrectionLevel(e.target.value)}
          disabled={loading}
        >
          <option value="L">L - Low (~7%)</option>
          <option value="M">M - Medium (~15%)</option>
          <option value="Q">Q - Quartile (~25%)</option>
          <option value="H">H - High (~30%)</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="margin">Margin: {margin}</label>
        <input
          type="range"
          id="margin"
          min="0"
          max="10"
          value={margin}
          onChange={(e) => setMargin(Number(e.target.value))}
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="size">Size: {size}px</label>
        <input
          type="range"
          id="size"
          min="200"
          max="2000"
          step="50"
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        disabled={loading || !url.trim()}
        className="submit-button"
      >
        {loading ? "Generating..." : "Generate QR Code"}
      </button>
    </form>
  );
}
