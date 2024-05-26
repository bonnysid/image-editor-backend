import { v4 } from 'uuid';
import fs from 'fs';
import sizeOf from 'image-size';
import { Metadata, PNG } from 'pngjs';
import { ISizeCalculationResult } from 'image-size/dist/types/interface';
import sharp from 'sharp';

type OnReadyProps = {
  info: ISizeCalculationResult & {
    colorDepth: number;
    colorModel: string;
  },
  url: string;
}

const COLOR_MODELS = {
  0: 'Grayscale',
  2: 'RGB',
  3: 'Indexed Color',
  4: 'Grayscale with Alpha',
  6: 'RGBA',
}
export class ImagesService {
  static uploadImage(file: any, host: string, onReady: (props: OnReadyProps) => void) {
    const fileExtension = file.originalname.split('.').pop();
    const newFileName = `${v4()}.${fileExtension}`;
    const newFilePath = `images/${newFileName}`;
    const publicUrl = `http://${host}/images/${newFileName}`;


    fs.renameSync(file.path, newFilePath);

    const info = sizeOf(newFilePath);

    if (info.type === 'png') {
      const file = fs.readFileSync(newFilePath);
      const { data, ...png } = PNG.sync.read(file);

      onReady({
        info: {
          ...info,
          ...png,
          colorDepth: png.bpp * png.depth,
          colorModel: COLOR_MODELS[png.colorType] || 'Unknown',
        },
        url: publicUrl,
      })
    } else {
      onReady({
        info: {
          ...info,
          colorDepth: 24,
          colorModel: 'RGB',
        },
        url: publicUrl,
      })
    }
  }

  static getCMYK(file: any, host: string, onReady: (props: OnReadyProps) => void) {
    const fileExtension = file.originalname.split('.').pop();
    const fileId = v4();
    const newFileName = `${fileId}.${fileExtension}`;
    const cmykFileName = `${fileId}_cmyk.jpeg`;
    const newFilePath = `images/${newFileName}`;
    const publicUrl = `http://${host}/images/${cmykFileName}`;


    fs.renameSync(file.path, newFilePath);

    sharp(newFilePath)
      .toColourspace('cmyk')
      .toFile(`images/${fileId}_cmyk.jpeg`);

    const info = sizeOf(newFilePath);

    if (info.type === 'png') {
      const file = fs.readFileSync(newFilePath);
      const { data, ...png } = PNG.sync.read(file);

      onReady({
        info: {
          ...info,
          ...png,
          colorDepth: png.bpp * png.depth,
          colorModel: COLOR_MODELS[png.colorType] || 'Unknown',
        },
        url: publicUrl,
      })
    } else {
      onReady({
        info: {
          ...info,
          colorDepth: 24,
          colorModel: 'RGB',
        },
        url: publicUrl,
      })
    }
  }

}
