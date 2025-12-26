import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';

import { IsOptional, IsString } from 'class-validator';

import { User } from '../entities/user.entity';

export class UpdateUserDto extends PickType(PartialType(User), ['username'] as const) {
  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  username?: string;
}
