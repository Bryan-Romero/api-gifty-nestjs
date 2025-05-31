import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { SortOptions } from '../enums/sort-options.enum';

export class PaginationDto {
  @ApiPropertyOptional({ default: 10 })
  @IsInt()
  @Min(1) // Asegura que el usuario no pueda pedir menos de 1 elemento por página (no tiene sentido pedir 0 o menos).
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({ default: 0 })
  @IsInt()
  @Min(0) // Permite empezar desde el primer elemento (índice 0), que es lo correcto para paginación basada en offset.
  @IsOptional()
  offset?: number = 0;

  @ApiPropertyOptional({
    default: SortOptions.CREATED_AT_DESC,
    enum: SortOptions,
  })
  @IsOptional()
  @IsString()
  sort?: SortOptions = SortOptions.CREATED_AT_DESC;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  keyWord?: string;
}
