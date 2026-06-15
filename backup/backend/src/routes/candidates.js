const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const candidatesController = require('../controllers/candidatesController');
const { requireAdmin } = require('../middleware/auth');

// Configure multer for image uploads
const uploadsDir = path.join(__dirname, '../../uploads/candidates');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif/;
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype;

    if (allowed.test(ext) && allowed.test(mime)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

router.get('/', candidatesController.getAllCandidates);
router.get('/:id', candidatesController.getCandidateById);
router.post('/', requireAdmin, upload.single('image'), candidatesController.createCandidate);
router.put('/:id', requireAdmin, upload.single('image'), candidatesController.updateCandidate);
router.delete('/:id', requireAdmin, candidatesController.deleteCandidate);

module.exports = router;
