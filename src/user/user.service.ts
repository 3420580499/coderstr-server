import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { compareSync } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { username, nickname } = createUserDto;
    const isExists = await this.userRepository.findOne({
      where: { username },
    });
    if (isExists) {
      throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST);
    }
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async login(username: string, password: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.username=:username', { username })
      .getOne();
  }
  getUser(user) {
    return this.userRepository.findOne({
      where: { id: user.id },
    });
  }
  findAll() {
    return `This action returns all user`;
  }

  async findCount(username: string, role: string) {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    if (username) {
      queryBuilder.where('user.username LIKE :username', {
        username: `%${username}%`,
      });
    }
    if (role) {
      queryBuilder.andWhere('user.role=:role', {
        role,
      });
    }
    return await queryBuilder.getCount();
  }

  findOne(id: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.id=:id', { id })
      .getOne();
  }

  async update(id: string, updateUserDto: any) {
    const user = this.userRepository.create({ ...updateUserDto, id });
    return await this.userRepository.save(user);
  }

  async modify(updateUserDto: any) {
    const user = this.userRepository.create({ ...updateUserDto });
    return await this.userRepository.save(user);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findUserList(
    currentPage: number,
    size: number,
    username: string,
    role: string,
  ) {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.address',
        'user.birthDay',
        'user.email',
        'user.introduce',
        'user.nickname',
        'user.phone',
        'user.role',
        'user.sex',
        'user.username',
      ]);
    if (username) {
      queryBuilder.andWhere('user.username LIKE :username', {
        username: `%${username}%`,
      });
    }
    if (role) {
      queryBuilder.andWhere('user.role=:role', {
        role,
      });
    }
    return {
      total: await this.findCount(username, role),
      list: await queryBuilder
        .skip((currentPage - 1) * size)
        .take(size)
        .getMany(),
    };
  }
}
