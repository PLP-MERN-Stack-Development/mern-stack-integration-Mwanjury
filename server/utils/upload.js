const multer = require('multer');
const fs = require('fs');
const path = require('path');

const uploadsDir = process.env.UPLOADS_DIR || 'uploads';
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '_' + file.originalname.replace(/\s+/g, '-');
    cb(null, unique);
  }
});

const upload = multer({ storage });

module.exports = { upload };
