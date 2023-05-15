import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  async create(createTagDto: CreateTagDto) {
    const isExistTag = await this.tagRepository.findOne({
      where: { name: createTagDto.name },
    });
    if (isExistTag) {
      throw new HttpException('标签名已经存在', HttpStatus.BAD_REQUEST);
    }
    const tag = this.tagRepository.create(createTagDto);
    return await this.tagRepository.save(tag);
  }

  async list(page: number, size: number) {
    // return await this.tagRepository.find({
    //   skip: (page - 1) * size,
    //   take: size,
    // });
    return await this.tagRepository
      .createQueryBuilder()
      .setFindOptions({
        skip: (page - 1) * size,
        take: size,
      })
      .getMany();
  }

  async findAll() {
    return await this.tagRepository.createQueryBuilder().getMany();
  }

  async findOne(id: number) {
    return await this.tagRepository
      .createQueryBuilder('tag')
      .where('tag.id=:id', { id })
      .getOne();
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    const isExistTag = await this.tagRepository.findOne({
      where: { name: updateTagDto.name },
    });
    if (isExistTag) {
      throw new HttpException('标签名已经存在', HttpStatus.BAD_REQUEST);
    }
    const updateResult = await this.tagRepository
      .createQueryBuilder('tag')
      .update()
      .set({ name: updateTagDto.name })
      .where('tag.id=:id', { id })
      .execute();
    if (updateResult.affected > 0) {
      return '修改成功';
    }
    throw new HttpException('更新标签失败', HttpStatus.BAD_REQUEST);
  }

  async remove(id: number) {
    const deleteResult = await this.tagRepository
      .createQueryBuilder('tag')
      .delete()
      .where('tag.id=:id', { id })
      .execute();
    if (deleteResult.affected > 0) {
      return '删除标签成功';
    }
    throw new HttpException('删除标签失败', HttpStatus.BAD_REQUEST);
  }

  async searchTags(query) {
    return await this.tagRepository.find({
      where: {
        name: Like(`%${query.name}%`),
      },
    });
  }

  async findByIds(ids: string[]) {
    return this.tagRepository.findBy({
      id: In([...ids]),
    });
  }

  async findCount(name: string, introduce: string) {
    const queryBuilder = this.tagRepository.createQueryBuilder('tag');
    if (name) {
      queryBuilder.andWhere('tag.name LIKE :name', {
        name: `%${name}%`,
      });
    }
    if (introduce) {
      queryBuilder.andWhere('tag.introduce LIKE :introduce', {
        introduce: `%${introduce}%`,
      });
    }
    return await queryBuilder.getCount();
  }

  async findTagList(
    currentPage: number,
    size: number,
    name: string,
    introduce: string,
  ) {
    const queryBuilder = this.tagRepository.createQueryBuilder('tag');
    if (name) {
      queryBuilder.andWhere('tag.name LIKE :name', {
        name: `%${name}%`,
      });
    }
    if (introduce) {
      queryBuilder.andWhere('tag.introduce LIKE :introduce', {
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

  async modify(updateTagDto: any) {
    await this.tagRepository
      .createQueryBuilder()
      .update(Tag)
      .set({
        name: updateTagDto.name,
        introduce: updateTagDto.introduce,
      })
      .where('id = :id', { id: updateTagDto.id })
      .execute();
  }
}
