import { ApiProperty, PickType } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

import { Favorite } from '../entities/favorite.entity';

export class AddFavoriteDto extends PickType(Favorite, ['gifId'] as const) {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  gifId: string;
}
