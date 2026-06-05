const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { requireAdmin } = require('../middleware/auth');

router.get('/stats', requireAdmin, dashboardController.getDashboardStats);
router.get('/activity', requireAdmin, dashboardController.getActivityLogs);
router.get('/results', requireAdmin, dashboardController.getElectionResults);
router.get('/results/position/:position', requireAdmin, dashboardController.getPositionResults);
router.get('/results/house', requireAdmin, dashboardController.getHouseResults);
router.get('/participation/class', requireAdmin, dashboardController.getParticipationByClass);
router.get('/participation/house', requireAdmin, dashboardController.getParticipationByHouse);
router.get('/activity/current', requireAdmin, dashboardController.getCurrentActivity);

module.exports = router;
