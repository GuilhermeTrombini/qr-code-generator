# QR Code Generator

A full-stack QR code generator application that creates styled QR codes and provides redirect functionality.

## Features

- Generate QR codes from URLs
- Multiple QR code styles and customization options
- High-quality QR code downloads
- Automatic redirect when QR codes are scanned
- Fast response times with optimized caching
- Modern React dashboard
- TypeScript throughout

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: SQLite (development) / PostgreSQL (production)
- **Deployment**: Fly.io
- **CI/CD**: GitHub Actions

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Run development servers (frontend + backend)
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Health Check: http://localhost:3000/health

### Development Scripts

```bash
# Run both frontend and backend
npm run dev

# Run only backend
npm run dev:backend

# Run only frontend
npm run dev:frontend

# Build for production
npm run build

# Build only backend
npm run build:backend

# Build only frontend
npm run build:frontend

# Start production server
npm start
```

## Features

- ✅ Generate QR codes from any URL
- ✅ Multiple style options (Square, Rounded, Dots, Classic)
- ✅ Customizable colors (foreground and background)
- ✅ Adjustable error correction levels
- ✅ High-quality PNG downloads
- ✅ Automatic redirect when QR codes are scanned
- ✅ Access tracking (scan count)
- ✅ Modern, responsive dashboard
- ✅ Fast API responses with optimized caching

## API Endpoints

- `POST /api/qr/create` - Create a new QR code
- `GET /api/qr/:id` - Get QR code details by ID
- `GET /api/qr` - List all QR codes
- `GET /:id` - Redirect to original URL (when QR code is scanned)
- `GET /health` - Health check endpoint

## Deployment

The application is configured for deployment on Fly.io with automatic CI/CD via GitHub Actions.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy

1. Install Fly CLI: `brew install flyctl` (or see [Fly.io docs](https://fly.io/docs/getting-started/installing-flyctl/))
2. Login: `fly auth login`
3. Deploy: `fly deploy`

### CI/CD

The project includes GitHub Actions workflows:
- **CI**: Runs on PRs and pushes to main (type checking and builds)
- **Deploy**: Automatically deploys to Fly.io on push to main branch

To enable automatic deployment:
1. Get your Fly.io API token from https://fly.io/user/personal_access_tokens
2. Add it as a GitHub secret named `FLY_API_TOKEN`

