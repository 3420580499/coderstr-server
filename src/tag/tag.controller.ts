import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Role } from 'src/auth/role.decorator';
import { RolesGuard } from 'src/auth/role.gurad';
import { AuthGuard } from '@nestjs/passport';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post('/create')
  @Role('admin')
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagService.create(createTagDto);
  }

  @Get('/list')
  @Role('admin', 'author', 'readers')
  list(@Query('page') page: number, @Query('size') size: number) {
    return this.tagService.list(page, size);
  }

  // 分页 标签
  @Get('/pageList')
  // 先给与所有角色权限
  @Role('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  findUserList(
    @Query('page') currentPage: number,
    @Query('size') size: number,
    @Query('name') name: string,
    @Query('introduce') introduce: string,
  ) {
    return this.tagService.findTagList(currentPage, size, name, introduce);
  }

  @Patch('/modify')
  modify(@Body() updateTagDto: any) {
    return this.tagService.modify(updateTagDto);
  }

  @Get('/findAll')
  @Role('admin', 'author', 'readers')
  findAll() {
    console.log(123);
    return this.tagService.findAll();
  }

  @Get('/search')
  @Role('admin', 'author', 'readers')
  searchTags(@Query() query) {
    console.log(1234213);
    return this.tagService.searchTags(query);
  }

  @Get('/:id')
  @Role('admin', 'author', 'readers')
  findOne(@Param('id') id: string) {
    console.log(123);
    return this.tagService.findOne(+id);
  }

  @Patch(':id')
  @Role('admin', 'author', 'readers')
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    console.log(updateTagDto);
    return this.tagService.update(+id, updateTagDto);
  }

  @Delete(':id')
  @Role('admin', 'author', 'readers')
  remove(@Param('id') id: string) {
    return this.tagService.remove(+id);
  }
}
