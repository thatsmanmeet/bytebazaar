import express from 'express';
import path from 'path';
import multer from 'multer';
import { authMiddleware } from '../middlewares/authmiddleware.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './uploads');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function fileFilter(req, file, cb) {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Images only!'), false);
  }
}

const upload = multer({ storage, fileFilter });
// Update to accept multiple images with field name "images"
const uploadMultipleImages = upload.array('images', 10);

router.post('/', authMiddleware, (req, res) => {
  uploadMultipleImages(req, res, function (err) {
    if (err) {
      return res.status(400).send({ message: err.message });
    }

    // Map each uploaded file to its accessible path
    const imagePaths = req.files.map((file) => `/${file.path}`);

    res.status(200).send({
      message: 'Images uploaded successfully',
      images: imagePaths,
    });
  });
});

export default router;
