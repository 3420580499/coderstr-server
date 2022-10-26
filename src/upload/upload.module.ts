import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, resolve } from 'path';
import { PostsModule } from 'src/posts/posts.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: resolve(__dirname, '../images'),
        filename: (req, file, cb) => {
          const filename = `${new Date().getTime()}${extname(
            file.originalname,
          )}`;
          return cb(null, filename);
        },
      }),
    }),
    PostsModule,
    UserModule,
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
