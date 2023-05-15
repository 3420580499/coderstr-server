import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/auth/role.decorator';
import { RolesGuard } from 'src/auth/role.gurad';
import { User } from 'src/user/entities/user.entity';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('/create')
  // 先给与所有角色权限
  @Role('admin', 'author', 'readers')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  create(@Body() createPostDto: CreatePostDto, @Req() req) {
    return this.postsService.create(createPostDto, req.user);
  }

  // 分页 文章列表
  @Get('/list')
  // 先给与所有角色权限
  @Role('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  getPostPageList(
    @Query('sortId') sortId: string,
    @Query('page') page: number,
    @Query('size') size: number,
    @Query('status') status: string,
    @Query('title') title: string,
  ) {
    console.log(sortId, page, size, status, title);
    return this.postsService.findPagePostList(
      sortId,
      page,
      size,
      status,
      title,
    );
  }

  // 分页 文章列表
  @Get('/mylist')
  // 先给与所有角色权限
  @Role('admin', 'author')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  getMyPostPageList(
    @Req() req,
    @Query('sortId') sortId: string,
    @Query('page') page: number,
    @Query('size') size: number,
    @Query('status') status: string,
    @Query('title') title: string,
  ) {
    console.log(sortId, page, size, status, title);
    return this.postsService.getMyPostPageList(
      req.user.id,
      sortId,
      page,
      size,
      status,
      title,
    );
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  // 文章id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }
  // 分类id
  @Get('/sort/:id')
  findeOneBySortId(
    @Param('id') id: string,
    @Query('page') currentPage: number,
    @Query('size') size: number,
    @Query('rule') rule: number,
  ) {
    return this.postsService.findeOneBySortId(id, currentPage, size, rule);
  }

  @Patch('/update/:id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }

  // 用户概览之 数据统计
  @Get('/overview/postsCount')
  // 先给与所有角色权限
  @Role('admin', 'author')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  findPostsCount(@Req() req) {
    return this.postsService.findPostsCount(req.user.id);
  }

  // 用户概览之 收获统计
  @Get('/overview/likeAndReadCount')
  // 先给与所有角色权限
  @Role('admin', 'author')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  findLikeAndReadCount(@Req() req) {
    return this.postsService.findLikeAndReadCount(req.user.id);
  }

  // 用户概览之 用户文章点赞排行
  @Get('/overview/likeTop')
  // 先给与所有角色权限
  @Role('admin', 'author')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  findLikeTop(@Req() req) {
    return this.postsService.findLikeTop(req.user.id);
  }

  // 用户概览之 用户文章阅读排行
  @Get('/overview/readTop')
  // 先给与所有角色权限
  @Role('admin', 'author')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  findReadTop(@Req() req) {
    return this.postsService.findReadTop(req.user.id);
  }

  // 文章阅读量增加
  @Get('/addRead/:id')
  addReadCount(@Param('id') id: string) {
    return this.postsService.addReadCount(id);
  }

  // 文章审核
  @Post('/check')
  checkPost(@Body() updatePostDto: any) {
    return this.postsService.checkPost(updatePostDto);
  }

  // 文章 -审核文章用户查询content
  @Get('/info/:id')
  // 先给与所有角色权限
  @Role('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  getpostContent(@Param('id') id: string) {
    return this.postsService.getpostContent(id);
  }

  // 我的文章 -详情
  @Get('/mypost/:id')
  // 先给与所有角色权限
  @Role('admin', 'author')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  getMyPostContent(@Param('id') id: string) {
    return this.postsService.getMyPostContent(id);
  }
}
