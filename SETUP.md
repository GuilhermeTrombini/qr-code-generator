# Setup Instructions

## Initial Setup

1. **Clone the repository** (if applicable):
   ```bash
   git clone <repository-url>
   cd qr-code-generator
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables** (optional):
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` if you need to customize:
   - `PORT`: Backend server port (default: 3000)
   - `DATABASE_PATH`: SQLite database path
   - `VITE_API_URL`: Frontend API URL (default: http://localhost:3000/api)

4. **Start development servers**:
   ```bash
   npm run dev
   ```

   This will start:
   - Backend on http://localhost:3000
   - Frontend on http://localhost:5173

## Project Structure

```
qr-code-generator/
├── backend/           # Node.js + Express backend
│   ├── src/
│   │   ├── index.ts          # Main server file
│   │   ├── database.ts       # Database setup
│   │   ├── models/           # Data models
│   │   ├── routes/           # API routes
│   │   └── services/         # Business logic
│   └── package.json
├── frontend/         # React + Vite frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── App.tsx           # Main app component
│   │   └── main.tsx          # Entry point
│   └── package.json
├── .github/
│   └── workflows/    # CI/CD pipelines
├── Dockerfile        # Production Docker image
├── fly.toml          # Fly.io configuration
└── package.json      # Root workspace config
```

## Troubleshooting

### Port already in use

If port 3000 or 5173 is already in use:

1. Change the backend port in `.env`:
   ```
   PORT=3001
   ```

2. Update frontend API URL in `.env`:
   ```
   VITE_API_URL=http://localhost:3001/api
   ```

### Database issues

If you encounter database errors:

1. Ensure the `data` directory exists:
   ```bash
   mkdir -p backend/data
   ```

2. Delete the database file to start fresh:
   ```bash
   rm backend/data/qr_codes.db
   ```

### Build errors

If you encounter build errors:

1. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules backend/node_modules frontend/node_modules
   npm install
   ```

2. Clear build artifacts:
   ```bash
   rm -rf backend/dist frontend/dist
   ```

