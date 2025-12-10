# StacksLend Backend

Backend API and event monitoring service for StacksLend - a decentralized lending protocol on Stacks blockchain. Handles Chainhook webhooks, real-time event processing, and data aggregation.

## Features

- 🔗 **Chainhook Integration** - Real-time blockchain event monitoring
- 📊 **Event Processing** - Handles deposits, borrows, repayments, and liquidations
- 🗄️ **Data Persistence** - Stores transaction history and analytics
- 🔌 **REST API** - Endpoints for frontend integration
- ⚡ **WebSocket Support** - Real-time updates to connected clients

## Architecture

```
Smart Contract → Stacks Blockchain → Chainhook → Backend API → Frontend
```

## Prerequisites

- Node.js 18+ and npm
- Docker (for running Chainhook service)
- PostgreSQL or MongoDB (for data storage)

## Installation

```bash
# Install dependencies
npm install

# Install Chainhook client types
npm install @hirosystems/chainhooks-client

# Install development dependencies
npm install -D typescript @types/node @types/express
```

## Project Structure

```
backend/
├── src/
│   ├── webhooks/          # Chainhook webhook handlers
│   ├── services/          # Business logic for event processing
│   ├── database/          # Database models and migrations
│   ├── api/               # REST API endpoints
│   └── index.ts           # Server entry point
├── chainhook-config.json  # Chainhook predicate configuration
├── package.json
└── tsconfig.json
```

## Configuration

### 1. Set Up Environment Variables

Create a `.env` file:

```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/stackslend
CHAINHOOK_WEBHOOK_URL=http://localhost:3000/chainhook/events
CONTRACT_ADDRESS=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.lending-pool
NETWORK=testnet
```

### 2. Configure Chainhook

Update `chainhook-config.json` with your contract address and webhook URL.

## Running the Service

### Start Backend Server

```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

### Start Chainhook Service

```bash
# Using Docker (recommended)
docker run -d \
  --name stackslend-chainhook \
  -p 20456:20456 \
  -v $(pwd)/chainhook-config.json:/config.json \
  hirosystems/chainhook:latest \
  start --config-path=/config.json

# Or using Chainhook CLI
chainhook start --config-path=chainhook-config.json
```

## API Endpoints

### Events
- `GET /api/events` - Get all lending events
- `GET /api/events/:txId` - Get specific transaction
- `GET /api/events/user/:address` - Get user's transaction history

### Analytics
- `GET /api/analytics/tvl` - Total Value Locked
- `GET /api/analytics/utilization` - Protocol utilization rate
- `GET /api/analytics/apy` - Current borrow APY

### WebSocket
- `ws://localhost:3000/ws` - Real-time event stream

## Monitored Events

The backend monitors the following smart contract events:

- `deposit-stx` - User deposits STX as collateral
- `borrow-stx` - User borrows against collateral
- `repay` - User repays borrowed amount
- `liquidate` - Liquidator liquidates undercollateralized position
- `ft_transfer` - sBTC token transfers

## Development

```bash
# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

## Deployment

### Deploy Backend
- **Recommended**: Railway, Render, or AWS
- Ensure environment variables are set
- Database should be accessible

### Deploy Chainhook
- Run as Docker container on VPS
- Configure webhook URL to point to your backend
- Ensure network connectivity to Stacks node

## Resources

- [Chainhook Documentation](https://docs.hiro.so/chainhook)
- [Implementation Guide](../chainhookImplementation.md)
- [Smart Contract Repository](https://github.com/StacksLend/stackslend-smart-contract)
- [Frontend Repository](https://github.com/StacksLend/stackslend-frontend)

## License

MIT
