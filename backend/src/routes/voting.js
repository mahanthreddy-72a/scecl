const express = require('express');
const router = express.Router();
const votingController = require('../controllers/votingController');
const { requireStudent } = require('../middleware/auth');

router.post('/submit', requireStudent, votingController.submitVotes);
router.get('/positions', requireStudent, votingController.getAllPositions);
router.get('/candidates/:position', requireStudent, votingController.getCandidatesByPosition);
router.post('/activity', requireStudent, votingController.logActivity);

module.exports = router;
