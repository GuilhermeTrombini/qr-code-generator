# Deployment Guide

## Fly.io Deployment

### Prerequisites

1. Install [Fly CLI](https://fly.io/docs/getting-started/installing-flyctl/)
2. Create a Fly.io account: `fly auth signup`
3. Login: `fly auth login`

### Initial Setup

1. **Create the Fly.io app** (if not already created):
   ```bash
   fly apps create qr-code-generator
   ```

2. **Set up secrets** (if needed):
   ```bash
   fly secrets set DATABASE_PATH=/app/data/qr_codes.db
   ```

3. **Deploy**:
   ```bash
   fly deploy
   ```

### GitHub Actions Setup

1. **Get Fly.io API token**:
   - Go to https://fly.io/user/personal_access_tokens
   - Create a new token

2. **Add secret to GitHub**:
   - Go to your repository settings
   - Navigate to Secrets and variables > Actions
   - Add a new secret named `FLY_API_TOKEN` with your token

3. **Push to main branch**:
   - The CI/CD pipeline will automatically deploy on push to `main`

### Manual Deployment

```bash
# Build and deploy
fly deploy

# Check status
fly status

# View logs
fly logs
```

### Environment Variables

The following environment variables can be set:

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (production/development)
- `DATABASE_PATH`: Path to SQLite database file

### Database Persistence

The SQLite database is stored in `/app/data/qr_codes.db`. For production, consider:

1. Using Fly.io volumes for persistent storage
2. Migrating to PostgreSQL (recommended for production)

To add a volume:

```bash
fly volumes create qr_data --size 1 --region iad
```

Then update `fly.toml` to mount the volume.

