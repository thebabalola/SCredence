import express from 'express';
import {
  getAllDeposits,
  getAllBorrows,
  getAllRepayments,
  getAllLiquidations,
  getUserEvents
} from '../services/lending-events';
import { getProtocolAnalytics, getUserAnalytics } from '../services/analytics';

const router = express.Router();

// Events endpoints
router.get('/events', (req, res) => {
  const allEvents = {
    deposits: getAllDeposits(),
    borrows: getAllBorrows(),
    repayments: getAllRepayments(),
    liquidations: getAllLiquidations()
  };
  
  res.json(allEvents);
});

router.get('/events/deposits', (req, res) => {
  res.json(getAllDeposits());
});

router.get('/events/borrows', (req, res) => {
  res.json(getAllBorrows());
});

router.get('/events/repayments', (req, res) => {
  res.json(getAllRepayments());
});

router.get('/events/liquidations', (req, res) => {
  res.json(getAllLiquidations());
});

router.get('/events/user/:address', (req, res) => {
  const { address } = req.params;
  const userEvents = getUserEvents(address);
  res.json(userEvents);
});

// Analytics endpoints
router.get('/analytics', (req, res) => {
  const analytics = getProtocolAnalytics();
  res.json(analytics);
});

router.get('/analytics/tvl', (req, res) => {
  const analytics = getProtocolAnalytics();
  res.json({ tvl: analytics.tvl });
});

router.get('/analytics/utilization', (req, res) => {
  const analytics = getProtocolAnalytics();
  res.json({ utilizationRate: analytics.utilizationRate });
});

router.get('/analytics/user/:address', (req, res) => {
  const { address } = req.params;
  const userAnalytics = getUserAnalytics(address);
  res.json(userAnalytics);
});

export default router;
