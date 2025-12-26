import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';

import { MessageResDto } from 'src/common/dtos';
import { StandardMessage } from 'src/common/enums';
import { ConfigurationType, JwtType } from 'src/config/configuration.interface';
import { MailService } from 'src/modules/mail/mail.service';
import { User, UserModel } from 'src/modules/user/entities/user.entity';

import { EmailVerifiedDto } from '../dto/email-verified.dto';
import { ResendEmailDto } from '../dto/resend-email.dto';

@Injectable()
export class VerificationService {
  constructor(
    @InjectModel(User.name) private userModel: UserModel,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<ConfigurationType>,
  ) {}

  async emailVerified(emailVerifiedDto: EmailVerifiedDto): Promise<MessageResDto> {
    try {
      const { token } = emailVerifiedDto;
      const { mail_secret } = this.configService.get<JwtType>('jwt');
      const payload = this.jwtService.verify(token, {
        secret: mail_secret,
      });
      // Busca el usuario por email y márcalo como verificado
      await this.userModel.updateOne({ email: payload.email }, { emailVerified: true });
      return { message: StandardMessage.SUCCESS };
    } catch (e) {
      throw new BadRequestException('Invalid or expired token');
    }
  }

  async resendVerificationEmail(resendEmailDto: ResendEmailDto): Promise<MessageResDto> {
    const { email } = resendEmailDto;
    const user = await this.userModel.findOne({ email, active: true });
    if (!user) return { message: StandardMessage.SUCCESS };

    await this.mailService.sendUserConfirmation(user);

    return {
      message: StandardMessage.SUCCESS,
    };
  }
}
