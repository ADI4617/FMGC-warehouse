# Deployment

## Environment Variables
```
NODE_ENV=development
PORT=3001
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRES_IN=24h
GEMINI_API_KEY=your-gemini-api-key
CORS_ORIGIN=http://localhost:3000
DB_PATH=./data/fmcg.db
```

## Development
```bash
cd backend
npm install
npm run dev
```

## Production
```bash
cd backend
npm run build
npm start
```

## Health Check
GET /api/v1/health → { success: true, data: { status: "ok", timestamp: "..." } }

## Database
SQLite file at `DB_PATH`. Auto-created on first run with migrations and seed data.

## Logging
Structured JSON logs to stdout. Request ID tracing via middleware.
