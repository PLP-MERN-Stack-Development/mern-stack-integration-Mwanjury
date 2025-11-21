import multer from 'multer';
import fs from 'fs';
import path from 'path';

const uploadsDir = process.env.UPLOADS_DIR || 'uploads';

// Create uploads folder if missing
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '_' + file.originalname.replace(/\s+/g, '-');
    cb(null, unique);
  }
});

export const upload = multer({ storage });
