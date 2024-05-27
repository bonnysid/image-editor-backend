import { v4 } from 'uuid';
import fs from 'fs';
import sizeOf from 'image-size';
import { Metadata, PNG } from 'pngjs';
import { ISizeCalculationResult } from 'image-size/dist/types/interface';
import { spawn } from 'child_process';
import * as path from 'path';
import cv from 'opencv4nodejs';

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

      const cap = new cv.VideoCapture(path.resolve(newFilePath));
      const frames: cv.Mat[] = [];
      let frame: cv.Mat;

      const bgSubtractor = new cv.BackgroundSubtractorMOG2();

      while ((frame = cap.read()).empty === false) {
        let processedFrame: cv.Mat;

        if (processType === 'background_subtraction') {
          const fgMask = bgSubtractor.apply(frame);
          processedFrame = fgMask;
        } else if (processType === 'blur_moving_objects') {
          const fgMask = bgSubtractor.apply(frame);
          const blurredFrame = frame.gaussianBlur(new cv.Size(21, 21), 0);
          processedFrame = frame.copy();
          blurredFrame.copyTo(processedFrame, fgMask);
        }

        // @ts-ignore
        frames.push(processedFrame);
      }

      const tempDir = path.join(__dirname, '../uploads/temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
      }

      const tempFramesPath = path.join(tempDir, 'frame_%04d.png');
      frames.forEach((frame, index) => {
        const filePath = tempFramesPath.replace('%04d', String(index).padStart(4, '0'));
        cv.imwrite(filePath, frame);
      });

      const ffmpegArgs = [
        '-y', // Overwrite output files without asking
        '-i', path.join(tempDir, 'frame_%04d.png'), // Input file
        '-vf', filter,
        '-c:v', 'libx264', // Video codec
        '-pix_fmt', 'yuv420p', // Pixel format
        `videos/${outputPath}` // Output file
      ];

      const ffmpeg = spawn('C:\\ffmpeg\\bin\\ffmpeg.exe', ffmpegArgs);

      ffmpeg.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
      });

      ffmpeg.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
      });

      ffmpeg.on('close', (code) => {
        frames.forEach((_, index) => {
          const filePath = tempFramesPath.replace('%04d', String(index).padStart(4, '0'));
          fs.unlinkSync(filePath);
        });

        if (code === 0) {
          resolve(outputPath);
        } else {
          reject(new Error(`FFmpeg exited with code ${code}`));
        }
      });
    });
  };

}
