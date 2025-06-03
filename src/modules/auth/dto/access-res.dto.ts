import { ApiProperty, PickType } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { Role } from 'src/common/enums';
import { User } from 'src/modules/user/entities/user.entity';

export class UserAccessResDto extends PickType(User, [
  '_id',
  'createdAt',
  'updatedAt',
  'active',
  'username',
  'email',
  'emailVerified',
  'roles',
] as const) {
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  @ApiProperty({ type: String })
  createdAt: String;

  @ApiProperty({ type: String })
  updatedAt: String;

  @ApiProperty({ type: Boolean })
  active: boolean;

  @ApiProperty({ type: String })
  username: string;

  @ApiProperty({ type: String })
  email: string;

  @ApiProperty({ type: Boolean })
  emailVerified: boolean;

  @ApiProperty({ type: Role, enum: Role })
  roles: Role[];
}

export class TokensAccessResDto {
  @ApiProperty({ type: String })
  access_token: string;

  @ApiProperty({ type: Number })
  expires_in: number;

  @ApiProperty({ type: String })
  refresh_token: string;
}

export class AccessResDto {
  @ApiProperty({ type: UserAccessResDto })
  user: UserAccessResDto;

  @ApiProperty({ type: TokensAccessResDto })
  tokens: TokensAccessResDto;
}
