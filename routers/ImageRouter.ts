import { Router } from 'express';

import multer from 'multer';
import { ImageController } from '../controllers';
import bodyParser from "body-parser";


const upload = multer({ dest: 'images/' });

const router = Router();

router.post(
  '/image',
  upload.single('photo'),
  ImageController.uploadImage
);
router.post(
  '/process',
  upload.single('photo'),
  bodyParser.urlencoded({ extended: true }),
  ImageController.processImage
);
router.post(
  '/cmyk',
  upload.single('photo'),
  ImageController.getCmyk
);

export default router;
