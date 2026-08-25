const Candidate = require('../models/Candidate');
const mongoose = require('mongoose');

// @route GET /api/analytics/summary
// Basic KPI cards: total applicants, total hired, avg time-to-hire, offer acceptance rate
const getSummary = async (req, res) => {
  try {
    const totalApplicants = await Candidate.countDocuments();
    const totalHired = await Candidate.countDocuments({ stage: 'Hired' });
    const totalOffered = await Candidate.countDocuments({ stage: { $in: ['Offered', 'Hired'] } });
    const totalRejected = await Candidate.countDocuments({ stage: 'Rejected' });

    const hiredCandidates = await Candidate.find({ stage: 'Hired', hiredDate: { $exists: true } });
    let avgTimeToHire = 0;
    if (hiredCandidates.length > 0) {
      const totalDays = hiredCandidates.reduce((sum, c) => {
        const days = (new Date(c.hiredDate) - new Date(c.appliedDate)) / (1000 * 60 * 60 * 24);
        return sum + days;
      }, 0);
      avgTimeToHire = Math.round((totalDays / hiredCandidates.length) * 10) / 10;
    }

    const offerAcceptanceRate =
      totalOffered > 0 ? Math.round((totalHired / totalOffered) * 1000) / 10 : 0;

    res.json({
      totalApplicants,
      totalHired,
      totalRejected,
      avgTimeToHireDays: avgTimeToHire,
      offerAcceptanceRatePercent: offerAcceptanceRate,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error computing summary', error: err.message });
  }
};

// @route GET /api/analytics/source-effectiveness
// Which recruitment source brings the most hires
const getSourceEffectiveness = async (req, res) => {
  try {
    const data = await Candidate.aggregate([
      {
        $group: {
          _id: '$source',
          totalApplicants: { $sum: 1 },
          totalHired: {
            $sum: { $cond: [{ $eq: ['$stage', 'Hired'] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          source: '$_id',
          _id: 0,
          totalApplicants: 1,
          totalHired: 1,
          conversionRatePercent: {
            $cond: [
              { $eq: ['$totalApplicants', 0] },
              0,
              { $multiply: [{ $divide: ['$totalHired', '$totalApplicants'] }, 100] },
            ],
          },
        },
      },
      { $sort: { totalHired: -1 } },
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Error computing source effectiveness', error: err.message });
  }
};

// @route GET /api/analytics/time-to-hire
// Average time-to-hire grouped by department
const getTimeToHireByDepartment = async (req, res) => {
  try {
    const data = await Candidate.aggregate([
      { $match: { stage: 'Hired', hiredDate: { $exists: true } } },
      {
        $project: {
          department: 1,
          daysToHire: {
            $divide: [{ $subtract: ['$hiredDate', '$appliedDate'] }, 1000 * 60 * 60 * 24],
          },
        },
      },
      {
        $group: {
          _id: '$department',
          avgDaysToHire: { $avg: '$daysToHire' },
          totalHired: { $sum: 1 },
        },
      },
      {
        $project: {
          department: '$_id',
          _id: 0,
          avgDaysToHire: { $round: ['$avgDaysToHire', 1] },
          totalHired: 1,
        },
      },
      { $sort: { avgDaysToHire: 1 } },
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Error computing time-to-hire', error: err.message });
  }
};

// @route GET /api/analytics/funnel
// Applicant funnel: Applied -> Shortlisted -> Interviewed -> Offered -> Hired
const getFunnel = async (req, res) => {
  try {
    const stages = ['Applied', 'Shortlisted', 'Interviewed', 'Offered', 'Hired'];
    const funnel = [];

    for (const stage of stages) {
      let count;
      if (stage === 'Applied') {
        count = await Candidate.countDocuments(); // everyone starts as applied
      } else {
        // count candidates who reached at least this stage (current stage or beyond)
        const stageIndex = stages.indexOf(stage);
        const reachedStages = stages.slice(stageIndex);
        count = await Candidate.countDocuments({ stage: { $in: reachedStages } });
      }
      funnel.push({ stage, count });
    }

    res.json(funnel);
  } catch (err) {
    res.status(500).json({ message: 'Error computing funnel', error: err.message });
  }
};

// @route GET /api/analytics/department-hiring
// Hiring volume per department
const getDepartmentHiring = async (req, res) => {
  try {
    const data = await Candidate.aggregate([
      {
        $group: {
          _id: '$department',
          totalApplicants: { $sum: 1 },
          totalHired: { $sum: { $cond: [{ $eq: ['$stage', 'Hired'] }, 1, 0] } },
        },
      },
      {
        $project: {
          department: '$_id',
          _id: 0,
          totalApplicants: 1,
          totalHired: 1,
        },
      },
      { $sort: { totalApplicants: -1 } },
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Error computing department hiring', error: err.message });
  }
};

// @route GET /api/analytics/monthly-trend
// Monthly hiring trend (applications vs hires per month)
const getMonthlyTrend = async (req, res) => {
  try {
    const data = await Candidate.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$appliedDate' },
            month: { $month: '$appliedDate' },
          },
          totalApplicants: { $sum: 1 },
          totalHired: { $sum: { $cond: [{ $eq: ['$stage', 'Hired'] }, 1, 0] } },
        },
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          totalApplicants: 1,
          totalHired: 1,
        },
      },
      { $sort: { year: 1, month: 1 } },
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Error computing monthly trend', error: err.message });
  }
};

module.exports = {
  getSummary,
  getSourceEffectiveness,
  getTimeToHireByDepartment,
  getFunnel,
  getDepartmentHiring,
  getMonthlyTrend,
};
