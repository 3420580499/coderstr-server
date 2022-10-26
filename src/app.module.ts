import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import envConfig from '../environment/getEnvironmentCofing';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { TagModule } from './tag/tag.module';
import { Tag } from './tag/entities/tag.entity';
import { UploadModule } from './upload/upload.module';
import { Post } from './posts/entities/posts.entity';
import { CommentModule } from './comment/comment.module';
import { Comment } from './comment/entities/comment.entity';
import { SortModule } from './sort/sort.module';
import { Sort } from './sort/entities/sort.entity';
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 设置为全局
      load: [envConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'mysql', // 数据库类型
          entities: [User, Tag, Post, Comment, Sort], // 数据表实体
          host: configService.get('DB_HOST', 'localhost'), // 主机，默认为localhost
          port: configService.get<number>('DB_PORT', 3306), // 端口号
          username: configService.get('DB_USER', 'root'), // 用户名
          password: configService.get('DB_PASSWORD', 'root'), // 密码
          database: configService.get('DB_DATABASE', 'node_mysql'), //数据库名
          timezone: '+08:00', //服务器上配置的时区
          synchronize: true, //根据实体自动创建数据库表， 生产环境建议关闭
        };
      },
    }),
    PostsModule,
    UserModule,
    AuthModule,
    TagModule,
    UploadModule,
    CommentModule,
    SortModule,
    CacheModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
