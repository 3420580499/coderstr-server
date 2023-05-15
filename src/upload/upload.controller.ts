import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { PostsService } from 'src/posts/posts.service';
import { UserService } from 'src/user/user.service';

@Controller('upload')
@UseGuards(AuthGuard('jwt'))
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly postsService: PostsService,
    private readonly userService: UserService,
  ) {}

  // 文章内容中的图片单文件上传
  @Post('postsDetailImg')
  @UseInterceptors(FileInterceptor('file'))
  uploadFileOfPostsDetailImg(@UploadedFile() file) {
    const path = `static/post/detail/${file.filename}`;
    return path;
  }

  // 文章封面中的图片单文件上传
  @Post('postsCoverImg')
  @UseInterceptors(FileInterceptor('file'))
  uploadFilePostsCoverImg(@UploadedFile() file, @Req() req) {
    // 建立用户id的目录
    const path = `static/post/cover/${file.filename}`;
    // 这里不添加到数据库（不创建新的记录，而是只保存文件）（如果创建到数据库会造成很多条数据存放（用户一直上传图片））
    // this.postsService.create({ coverImg: path }, req.user);
    return path;
  }

  // 更新用户头像
  @Post('/updateUserImg')
  @UseInterceptors(FileInterceptor('file'))
  async updateUserImg(@UploadedFile() file, @Req() req) {
    const path = `static/avatar/${file.filename}`;
    const result = await this.userService.update(req.user.id, {
      avatarUrl: path,
    });
    return result;
  }

  @Post()
  create(@Body() createUploadDto: CreateUploadDto) {
    return this.uploadService.create(createUploadDto);
  }

  @Get()
  findAll() {
    return this.uploadService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.uploadService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUploadDto: UpdateUploadDto) {
    return this.uploadService.update(+id, updateUploadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.uploadService.remove(+id);
  }
}
