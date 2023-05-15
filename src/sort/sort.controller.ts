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
import { SortService } from './sort.service';
import { CreateSortDto } from './dto/create-sort.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/role.gurad';
import { Role } from 'src/auth/role.decorator';
import { UpdateSortDto } from './dto/update-sort.dto';

@Controller('sort')
export class SortController {
  constructor(private readonly sortService: SortService) {}

  @Post('/create')
  create(@Body() createSortDto: CreateSortDto) {
    return this.sortService.create(createSortDto);
  }

  @Get('/list')
  findAll() {
    return this.sortService.findAll();
  }

  // 分页 分类
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
    return this.sortService.findSortList(currentPage, size, name, introduce);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sortService.findOne(+id);
  }

  @Patch('/modify')
  update(@Body() updateSortDto: any) {
    return this.sortService.update(updateSortDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sortService.remove(+id);
  }
}
