import { Request, Response } from 'express';
import fs from 'fs';
import { v4 } from 'uuid';
import { VideoService } from '../services';

export class VideoController {
  static processVideo(req: Request, res: Response) {
    try {
      const file = (req as any).file;

      if (!file) {
        return res.status(400).send({ message: 'Нет файла' });
      }

      const {
        processType,
      } = req.body;

      VideoService.processVideo(file, processType)
        .then((output) => {
          res.json({ video_url: `http://${req.headers.host}/videos/${output}` });
        })
        .catch((error) => {
          res.status(500).json({ error: error.message });
        });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: 'Server error' })
    }
  }
}
