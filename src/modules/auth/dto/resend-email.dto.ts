import { ApiProperty, PickType } from '@nestjs/swagger';

import { IsEmail } from 'class-validator';
import { User } from 'src/modules/user/entities/user.entity';

export class ResendEmailDto extends PickType(User, ['email'] as const) {
  @ApiProperty({ type: String })
  @IsEmail()
  email: string;
}
