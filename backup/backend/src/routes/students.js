const express = require('express');
const router = express.Router();
const multer = require('multer');
const studentsController = require('../controllers/studentsController');
const { requireAdmin } = require('../middleware/auth');

const upload = multer({ storage: multer.memoryStorage() });

router.get('/', requireAdmin, studentsController.getAllStudents);
router.get('/:id', requireAdmin, studentsController.getStudentById);
router.post('/', requireAdmin, studentsController.createStudent);
router.put('/:id', requireAdmin, studentsController.updateStudent);
router.delete('/:id', requireAdmin, studentsController.deleteStudent);
router.post('/import/bulk', requireAdmin, upload.single('file'), studentsController.bulkImport);

module.exports = router;
