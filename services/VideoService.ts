import { v4 } from 'uuid';
import fs from 'fs';
import sizeOf from 'image-size';
import { Metadata, PNG } from 'pngjs';
import { ISizeCalculationResult } from 'image-size/dist/types/interface';
import { spawn } from 'child_process';
import * as path from 'path';
import ffmpeg from 'fluent-ffmpeg';
// import cv from 'opencv4nodejs';

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

ffmpeg.setFfmpegPath('C:/ffmpeg/bin/ffmpeg.exe'); // Укажите правильный путь к ffmpeg.exe
ffmpeg.setFfprobePath('C:/ffmpeg/bin/ffprobe.exe');

const ffmpegPath = 'ffmpeg'; // Или полный путь к ffmpeg, например, 'C:\\ffmpeg\\bin\\ffmpeg.exe'
export class VideoService {
  static processVideo(file: any, processType: string): Promise<string> {
    return new Promise((resolve, reject) => {

      const fileExtension = file.originalname.split('.').pop();
      const newFileName = `${v4()}.${fileExtension}`;
      const outputPath = `${v4()}_processed.${fileExtension}`;
      const newFilePath = `videos/${newFileName}`;
      const filter = processType === 'background_subtraction' ? 'hue=s=0' : 'scale=320:240';

      fs.renameSync(file.path, newFilePath);

      const ffmpegCommand = ffmpeg(path.resolve(newFilePath));

      console.log(processType)

      if (processType === 'background_subtraction') {
          console.log('Applying background subtraction filter');
          ffmpegCommand
              .videoFilters([
                  // 'minterpolate', // Создание интерполяции кадров
                  'tblend=all_mode=difference', // Вычитание кадров
                  'hue=s=0' // Конвертация в оттенки серого
              ]);
          // .videoFilters([
          //     'tblend=all_mode=subtract,all_opacity=0.7',
          //     'hue=s=0'
          // ]);
      } else if (processType === 'blur_moving_objects') {
          ffmpegCommand.videoFilters('tblend=all_mode=average,framestep=2');
      }

      ffmpegCommand
          .output(path.join('videos', outputPath))
          .on('start', (commandLine) => {
            console.log('Spawned Ffmpeg with command: ' + commandLine);
          })
          .on('progress', (progress) => {
            console.log(`Processing: ${progress.percent}% done`);
          })
          .on('end', () => {
            console.log('Processing finished successfully');
            fs.unlinkSync(path.resolve(newFilePath));
            resolve(outputPath);
          })
          .on('error', (err) => {
            console.error('Error processing video:', err);
          })
          .run();
    });
  };

}
