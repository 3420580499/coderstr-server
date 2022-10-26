import { PartialType } from '@nestjs/mapped-types';
import { CreateSortDto } from './create-sort.dto';

export class UpdateSortDto extends PartialType(CreateSortDto) {}
