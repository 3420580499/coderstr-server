import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  Req,
  Query,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/role.gurad';
import { Role } from 'src/auth/role.decorator';
import { AuthService } from 'src/auth/auth.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('/login')
  @UseGuards(AuthGuard('local'))
  async login(@Req() req) {
    console.log('/login');
    return this.authService.login(req.user);
  }

  @Get('/jwt')
  @UseGuards(AuthGuard('jwt'))
  getUserInfo(@Req() req) {
    return req.user;
  }

  @Post('/create')
  @UseInterceptors(ClassSerializerInterceptor)
  create(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    // throw new HttpException('发生异常', 201);
    return this.userService.findAll();
  }

  // 分页用户
  @Get('/list')
  // 先给与所有角色权限
  @Role('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  findUserList(
    @Query('page') currentPage: number,
    @Query('size') size: number,
    @Query('username') username: string,
    @Query('role') role: string,
  ) {
    return this.userService.findUserList(currentPage, size, username, role);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  // 个人信息变更
  @Patch('/update')
  @UseGuards(AuthGuard('jwt'))
  update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req.user.id, updateUserDto);
  }

  // 管理员变更用户信息
  @Patch('/modify')
  @UseGuards(AuthGuard('jwt'))
  modify(@Body() updateUserDto: any) {
    console.log(updateUserDto, '666');
    return this.userService.modify(updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
