import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Match } from 'src/common/utils/match.validator';
import { SignUpDto } from 'src/modules/auth/dto/sign-up.dto';

export class ResetPasswordDto extends PickType(SignUpDto, [
  'password',
  'confirmPassword',
] as const) {
  @ApiProperty({ type: String })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ type: String })
  @IsString()
  @Match('password', { message: 'Passwords must match' })
  confirmPassword: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  token: string;
}
