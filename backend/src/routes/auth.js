const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAdmin, requireStudent } = require('../middleware/auth');

router.post('/admin/login', authController.adminLogin);
router.post('/admin/logout', authController.adminLogout);
router.get('/admin/status', authController.getAdminStatus);

router.post('/student/login', authController.studentLogin);
router.post('/student/logout', authController.studentLogout);
router.get('/student/status', requireStudent, authController.getStudentStatus);

module.exports = router;
