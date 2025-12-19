import { BadRequestException, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FileUploadController } from './file.upload.controller';
import * as multer from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage: multer.memoryStorage(),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/^(image|video)\//)) {
          return cb(
            new BadRequestException('Only images and videos are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  ],
  controllers: [FileUploadController],
})
export class FileUploadModule {}

