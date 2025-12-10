# API

REST API endpoints for frontend integration.

## Files

- `routes.ts` - API route definitions
- `controllers/` - Request handlers
- `middleware/` - Authentication, validation, etc.

## Endpoints

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:txId` - Get specific transaction
- `GET /api/events/user/:address` - Get user history

### Analytics
- `GET /api/analytics/tvl` - Total Value Locked
- `GET /api/analytics/utilization` - Utilization rate
- `GET /api/analytics/apy` - Current APY

## TODO

Implement API endpoints and controllers.
