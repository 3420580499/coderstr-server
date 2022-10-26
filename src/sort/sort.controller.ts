import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SortService } from './sort.service';
import { CreateSortDto } from './dto/create-sort.dto';
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sortService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSortDto: UpdateSortDto) {
    return this.sortService.update(+id, updateSortDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sortService.remove(+id);
  }
}
