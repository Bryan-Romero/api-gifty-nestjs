import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { MessageResDto } from 'src/common/dtos';
import { StandardMessage } from 'src/common/enums';
import { JwtForgotPassPayload } from 'src/common/interfaces';
import { ConfigurationType, JwtType } from 'src/config/configuration.interface';
import { BcryptjsService } from 'src/modules/bcryptjs/bcryptjs.service';
import { MailService } from 'src/modules/mail/mail.service';
import { UserService } from 'src/modules/user/services/user.service';

import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { UpdatePasswordDto } from '../dto/update-password.dto';

@Injectable()
export class UserPasswordService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<ConfigurationType>,
    private readonly bcryptjsService: BcryptjsService,
    private readonly mailService: MailService,
  ) {}

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<MessageResDto> {
    const { email } = forgotPasswordDto;
    // Find user by email with exception if not found
    const user = await this.userService.findUserByEmail(email);

    await this.mailService.sendForgotPassword(user);

    return {
      message: StandardMessage.SUCCESS,
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<MessageResDto> {
    try {
      const { password, token } = resetPasswordDto;

      const secret = this.configService.get<JwtType>('jwt').password_secret;
      const { email } = await this.jwtService.verifyAsync<JwtForgotPassPayload>(token, { secret });

      // Find user by email with exception if not found
      const user = await this.userService.findUserByEmail(email);

      const hash = await this.bcryptjsService.hashData(password);
      user.password = hash;
      await user.save();

      return {
        message: StandardMessage.SUCCESS,
      };
    } catch (error) {
      throw new BadRequestException('Invalid or expired token');
    }
  }

  async updatePassword(_id: string, updatePasswordDto: UpdatePasswordDto): Promise<MessageResDto> {
    // Find user by id with exception if not found
    const user = await this.userService.findUserById(_id);

    const { password, confirmPassword } = updatePasswordDto;
    if (password !== confirmPassword) throw new BadRequestException('Passwords do not match');

    const hash = await this.bcryptjsService.hashData(password);
    user.password = hash;
    await user.save();

    return {
      message: StandardMessage.SUCCESS,
    };
  }
}
