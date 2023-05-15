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

  async update(updateSortDto: any) {
    await this.sortRepository
      .createQueryBuilder()
      .update(Sort)
      .set({
        name: updateSortDto.name,
        introduce: updateSortDto.introduce,
      })
      .where('id = :id', { id: updateSortDto.id })
      .execute();
  }

  remove(id: number) {
    return `This action removes a #${id} sort`;
  }

  async findCount(name: string, introduce: string) {
    const queryBuilder = this.sortRepository.createQueryBuilder('sort');
    if (name) {
      queryBuilder.andWhere('sort.name LIKE :name', {
        name: `%${name}%`,
      });
    }
    if (introduce) {
      queryBuilder.andWhere('sort.introduce LIKE :introduce', {
        introduce: `%${introduce}%`,
      });
    }
    return await queryBuilder.getCount();
  }

  async findSortList(
    currentPage: number,
    size: number,
    name: string,
    introduce: string,
  ) {
    const queryBuilder = this.sortRepository.createQueryBuilder('sort');
    if (name) {
      queryBuilder.andWhere('sort.name LIKE :name', {
        name: `%${name}%`,
      });
    }
    if (introduce) {
      queryBuilder.andWhere('sort.introduce LIKE :introduce', {
        introduce: `%${introduce}%`,
      });
    }
    return {
      total: await this.findCount(name, introduce),
      list: await queryBuilder
        .skip((currentPage - 1) * size)
        .take(size)
        .getMany(),
    };
  }
}
