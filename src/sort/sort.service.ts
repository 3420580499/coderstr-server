import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSortDto } from './dto/create-sort.dto';
import { UpdateSortDto } from './dto/update-sort.dto';
import { Sort } from './entities/sort.entity';

@Injectable()
export class SortService {
  constructor(
    @InjectRepository(Sort) private readonly sortRepository: Repository<Sort>,
  ) {}

  async create(createSortDto: CreateSortDto) {
    const sort = this.sortRepository.create(createSortDto);
    return await this.sortRepository.save(sort);
  }

  async findAll() {
    return await this.sortRepository.findAndCount();
  }

  async findOne(id: number) {
    return await this.sortRepository
      .createQueryBuilder('sort')
      .where('sort.id=:id', { id })
      .getOne();
  }

  async update(id: number, updateSortDto: any) {
    await this.sortRepository
      .createQueryBuilder()
      .update()
      .set({
        name: updateSortDto.name,
      })
      .execute();
  }

  remove(id: number) {
    return `This action removes a #${id} sort`;
  }
}
