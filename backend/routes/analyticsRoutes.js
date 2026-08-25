const express = require('express');
const router = express.Router();
const {
  getSummary,
  getSourceEffectiveness,
  getTimeToHireByDepartment,
  getFunnel,
  getDepartmentHiring,
  getMonthlyTrend,
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // all analytics routes require login

router.get('/summary', getSummary);
router.get('/source-effectiveness', getSourceEffectiveness);
router.get('/time-to-hire', getTimeToHireByDepartment);
router.get('/funnel', getFunnel);
router.get('/department-hiring', getDepartmentHiring);
router.get('/monthly-trend', getMonthlyTrend);

module.exports = router;
