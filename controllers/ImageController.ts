import { Request, Response } from 'express';
import fs from 'fs';
import { v4 } from 'uuid';
import { ImagesService } from '../services';
import * as path from "node:path";

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

  static async processImage(req: Request, res: Response) {
    const file = req.file;
    const method = req.body.method;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileExtension = file.originalname.split('.').pop();
    const newFileName = `${v4()}.${fileExtension}`;
    const newFilePath = `images/${newFileName}`;
    const fileOutputPath = `images/${v4()}_processed.${fileExtension}`;

    fs.renameSync(file.path, newFilePath);

    try {
      await ImagesService.detectKeypoints(path.resolve(newFilePath), method, fileOutputPath);
      res.json({ image_url: `http://${req.headers.host}/${fileOutputPath}` });
    } catch (error) {
      console.error('Error processing image:', error);
      res.status(500).json({ error: 'Error processing image' });
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
