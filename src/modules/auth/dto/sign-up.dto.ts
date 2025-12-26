import { ApiProperty, PickType } from '@nestjs/swagger';

import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Match } from 'src/common/utils/match.validator';
import { User } from 'src/modules/user/entities/user.entity';

export class SignUpDto extends PickType(User, ['username', 'email', 'password'] as const) {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ type: String })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ type: String })
  @IsString()
  @Match('password', { message: 'Passwords must match' })
  confirmPassword: string;
}
