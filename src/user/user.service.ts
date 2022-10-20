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
    const { username } = createUserDto;
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

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
