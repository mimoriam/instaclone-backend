import { IsOptional, IsString } from 'class-validator';
import { Filter } from '@prisma/client';

export class CreatePostDto {
  @IsString()
  readonly caption: string;

  @IsString()
  @IsOptional()
  readonly filter: Filter;
}
