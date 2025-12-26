import { ApiProperty } from '@nestjs/swagger';

import { PaginationResDto } from 'src/common/dtos';

import { Favorite } from '../entities/favorite.entity';

export class FindsGifsIdsResDto extends PaginationResDto {
  @ApiProperty({ type: [Favorite] })
  data: string[];
}
