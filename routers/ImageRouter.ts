import { Router } from 'express';

import multer from 'multer';
import { ImageController } from '../controllers';


const upload = multer({ dest: 'avatars/' });

const router = Router();

router.post(
  '/image',
  upload.single('photo'),
  ImageController.uploadImage
);
router.post(
  '/cmyk',
  upload.single('photo'),
  ImageController.getCmyk
);

export default router;
