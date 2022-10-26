import { Injectable } from '@nestjs/common';
import { CreateCacheDto } from './dto/create-cache.dto';
import { UpdateCacheDto } from './dto/update-cache.dto';

import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

// 提供redis服务
@Injectable()
export class CacheService {
  redisClient: Redis;

  constructor(private readonly configService: ConfigService) {
    console.log(this.configService.get('password'));
    this.redisClient = new Redis({
      port: configService.get('redis.port'), // Redis port
      host: configService.get('redis.host'), // Redis host
      // username: configService.get('redis.username'), // needs Redis >= 6
      password: configService.get('redis.password'),
      db: configService.get('redis.db'), // Defaults to 0
    });
  }

  async set(key: string, value: any, second?: number) {
    value = JSON.stringify(value);
    if (second) {
      //设置值,并设置存活时间
      await this.redisClient.set(key, value, 'EX', second);
    } else {
      await this.redisClient.set(key, value);
    }
  }

  async get(key: string) {
    const value = await this.redisClient.get(key);
    if (value) return JSON.parse(value);
    return null;
  }

  async del(key: string) {
    return await this.redisClient.del(key);
  }

  async delAll() {
    return await this.redisClient.flushall();
  }
  // create(createCacheDto: CreateCacheDto) {
  //   this.redisClient.set('test', '222');
  //   return 'This action adds a new cache';
  // }

  // findAll() {
  //   return `This action returns all cache`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} cache`;
  // }

  // update(id: number, updateCacheDto: UpdateCacheDto) {
  //   return `This action updates a #${id} cache`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} cache`;
  // }
}
