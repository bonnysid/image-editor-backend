import { Request, Response } from 'express';
import fs from 'fs';
import { v4 } from 'uuid';
import { ImagesService } from '../services';

export class ImageController {
  static uploadImage(req: Request, res: Response) {
    try {
      const file = (req as any).file;

      if (!file) {
        return res.status(400).send({ message: 'Нет файла' });
      }

      ImagesService.uploadImage(file, req.headers.host || '', (data) => {
        res.status(200).send({ message: 'Изображение обновлено', ...data })
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: 'Server error' })
    }
  }

  static getCmyk(req: Request, res: Response) {
    try {
      const file = (req as any).file;

      if (!file) {
        return res.status(400).send({ message: 'Нет файла' });
      }

      ImagesService.getCMYK(file, req.headers.host || '', (data) => {
        res.status(200).send({ message: 'Изображение обновлено', ...data })
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: 'Server error' })
    }
  }
}
