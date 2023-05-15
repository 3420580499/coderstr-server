import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, resolve } from 'path';
import { PostsModule } from 'src/posts/posts.module';
import { UserModule } from 'src/user/user.module';
import { createDirectoryIfNotExist } from 'utils/checkFilePath';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          let filePath = '';
          if (req.route.path === '/upload/updateUserImg') {
            filePath = resolve(__dirname, `../images/avatar`);
          } else if (req.route.path === '/upload/postsDetailImg') {
            filePath = resolve(__dirname, '../images/post/detail');
          } else if (req.route.path === '/upload/postsCoverImg') {
            filePath = resolve(__dirname, '../images/post/cover');
          }
          createDirectoryIfNotExist(filePath);
          cb(null, filePath);
        },
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
