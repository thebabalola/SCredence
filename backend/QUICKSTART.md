# StacksLend Backend - Quick Start Guide

## Installation

```bash
cd backend
npm install
```

## Configuration

1. Copy environment template:
```bash
cp .env.example .env
```

2. Update `.env` with your settings:
```env
PORT=3000
CONTRACT_ADDRESS=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lending-pool
NETWORK=testnet
```

## Running the Backend

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm run build
npm start
```

Server will start on `http://localhost:3000`

## API Endpoints

### Events
- `GET /api/events` - All events
- `GET /api/events/deposits` - All deposits
- `GET /api/events/borrows` - All borrows
- `GET /api/events/repayments` - All repayments
- `GET /api/events/liquidations` - All liquidations
- `GET /api/events/user/:address` - User's events

### Analytics
- `GET /api/analytics` - Protocol analytics
- `GET /api/analytics/tvl` - Total Value Locked
- `GET /api/analytics/utilization` - Utilization rate
- `GET /api/analytics/user/:address` - User analytics

### Health
- `GET /health` - Server health check

## Running Chainhook

```bash
# Using Docker
docker run -d \
  --name stackslend-chainhook \
  -p 20456:20456 \
  -v $(pwd)/chainhook-config.json:/config.json \
  hirosystems/chainhook:latest \
  start --config-path=/config.json
```

## Testing

```bash
# Test health endpoint
curl http://localhost:3000/health

# Test analytics
curl http://localhost:3000/api/analytics

# Test events
curl http://localhost:3000/api/events
```

## Recent Commits

1. ✅ Added lending events service
2. ✅ Added analytics service  
3. ✅ Integrated services into webhook handler
4. ✅ Added REST API routes
5. ✅ Integrated API into Express server

All code pushed to: https://github.com/StacksLend/stackslend-backend
