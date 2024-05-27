import { Router } from 'express';
import bodyParser from 'body-parser';

import multer from 'multer';
import { VideoController } from '../controllers';


const upload = multer({ dest: 'videos/' });

const router = Router();

router.post(
  '/process',
  upload.single('video'),
  bodyParser.urlencoded({ extended: true }),
  VideoController.processVideo
);

export default router;
