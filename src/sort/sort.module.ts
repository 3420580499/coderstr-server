import { Module } from '@nestjs/common';
import { SortService } from './sort.service';
import { SortController } from './sort.controller';
import { Sort } from './entities/sort.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Sort])],
  controllers: [SortController],
  providers: [SortService],
})
export class SortModule {}
