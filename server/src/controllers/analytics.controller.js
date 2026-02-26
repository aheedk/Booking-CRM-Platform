const analyticsService = require('../services/analytics.service');

async function getAnalytics(req, res, next) {
  try {
    const [summary, monthlyBookings, monthlyRevenue, statusBreakdown, topServices] =
      await Promise.all([
        analyticsService.getSummaryStats(),
        analyticsService.getMonthlyBookings(),
        analyticsService.getMonthlyRevenue(),
        analyticsService.getStatusBreakdown(),
        analyticsService.getTopServices(),
      ]);

    res.json({ summary, monthlyBookings, monthlyRevenue, statusBreakdown, topServices });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAnalytics };
