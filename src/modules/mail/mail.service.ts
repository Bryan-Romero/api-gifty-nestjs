import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ConfirmEmailContext } from 'src/common/interfaces';
import { ConfigurationType, JwtType } from 'src/config/configuration.interface';
import { User } from 'src/modules/user/entities/user.entity';

@Injectable()
export class MailService {
  private readonly frontend_url: string;

  constructor(
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<ConfigurationType>,
  ) {
    this.frontend_url = this.configService.get<string>('frontend_url');
  }

  async sendUserConfirmation(user: User) {
    try {
      const url = this.confirmationURL(user.email);
      const context: ConfirmEmailContext = {
        username: user.username,
        url,
        frontend_url: this.frontend_url,
      };

      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Welcome to Gifty App! Confirm your Email',
        template: './confirm-email', // `.hbs` extension is appended automatically
        context,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async sendForgotPassword(user: User) {
    try {
      const url = this.forgotPasswordURL(user.email);
      const context: ConfirmEmailContext = {
        username: user.username,
        url,
        frontend_url: this.frontend_url,
      };

      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Instructions to Reset your Password',
        template: './forgot-password', // `.hbs` extension is appended automatically
        context, // ✏️ filling curly brackets with content
      });
    } catch (error) {
      console.error(error);
    }
  }

  confirmationURL(email: string): string {
    const { mail_secret, mail_expires_in } =
      this.configService.get<JwtType>('jwt');
    const payload = { email };
    const token = this.jwtService.sign(payload, {
      secret: mail_secret,
      expiresIn: mail_expires_in,
    });

    const url = `${this.frontend_url}/auth/confirm?token=${token}`;

    return url;
  }

  forgotPasswordURL(email: string): string {
    const { password_secret, password_expires_in } =
      this.configService.get<JwtType>('jwt');
    const payload = { email };
    const token = this.jwtService.sign(payload, {
      secret: password_secret,
      expiresIn: password_expires_in,
    });

    const url = `${this.frontend_url}/auth/reset-password?token=${token}`;

    return url;
  }
}
