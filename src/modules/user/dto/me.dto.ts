import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { Role } from 'src/common/enums';
import { Types } from 'mongoose';

export class ME extends PickType(User, [
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
