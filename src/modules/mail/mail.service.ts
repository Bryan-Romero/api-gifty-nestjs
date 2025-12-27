import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { SendSmtpEmail, SendSmtpEmailToInner, TransactionalEmailsApi } from '@getbrevo/brevo';
import { MailerService } from '@nestjs-modules/mailer';
import * as fs from 'fs';
import * as Handlebars from 'handlebars';
import * as path from 'path';
import { EmailContextMap, EmailTemplate } from 'src/common/enums';
import { ConfirmEmailContext } from 'src/common/interfaces';
import { ConfigurationType, JwtType, MailType } from 'src/config/configuration.interface';
import { NodeEnv } from 'src/config/node-env.enum';
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
      const subject = 'Welcome to Gifty App! Confirm your Email';
      const context: ConfirmEmailContext = {
        username: user.username,
        url,
        frontend_url: this.frontend_url,
      };

      if (this.configService.get<NodeEnv>('node_env') === NodeEnv.DEVELOPMENT) {
        await this.mailerService.sendMail({
          to: user.email,
          subject,
          template: `./${EmailTemplate.CONFIRM_EMAIL}`, // `.hbs` extension is appended automatically
          context, // ✏️ filling curly brackets with content,
        });
      } else {
        await this.sendEmailByBrevo({
          context,
          subject,
          to: [{ email: user.email }],
          template: EmailTemplate.CONFIRM_EMAIL,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  async sendForgotPassword(user: User) {
    try {
      const url = this.forgotPasswordURL(user.email);
      const subject = 'Instructions to Reset your Password';
      const context: ConfirmEmailContext = {
        username: user.username,
        url,
        frontend_url: this.frontend_url,
      };

      if (this.configService.get<NodeEnv>('node_env') === NodeEnv.DEVELOPMENT) {
        await this.mailerService.sendMail({
          to: user.email,
          subject,
          template: `./${EmailTemplate.FORGOT_PASSWORD}`, // `.hbs` extension is appended automatically
          context, // ✏️ filling curly brackets with content
        });
      } else {
        await this.sendEmailByBrevo({
          context,
          subject,
          to: [{ email: user.email }],
          template: EmailTemplate.FORGOT_PASSWORD,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  async sendEmailByBrevo<T extends EmailTemplate>(params: {
    to: SendSmtpEmailToInner[];
    subject: string;
    context: EmailContextMap[T];
    template: T;
  }) {
    const { context, template, to, subject } = params;
    try {
      const emailAPI = new TransactionalEmailsApi();
      emailAPI['authentications'].apiKey.apiKey = this.configService.get<MailType>('mail').brevo_api_key;
      const senderEmail = this.configService.get<MailType>('mail').from;

      const templatePath = path.join(
        process.cwd(),
        'static',
        'templates',
        `${template.endsWith('.hbs') ? template : template + '.hbs'}`,
      );
      const templateSource = fs.readFileSync(templatePath, 'utf-8');
      const templateDelegate = Handlebars.compile(templateSource);

      const htmlContent = templateDelegate(context);

      const message = new SendSmtpEmail();
      message.subject = subject;
      message.htmlContent = htmlContent;
      message.sender = { name: 'GIFty', email: senderEmail };
      message.to = to;

      await emailAPI.sendTransacEmail(message);
      // .then((res) => {
      //   console.log(JSON.stringify(res.body));
      // })
      // .catch((err) => {
      //   console.error('Error sending email:', err.body);
      // });
    } catch (error) {
      console.error(error);
    }
  }

  confirmationURL(email: string): string {
    const { mail_secret, mail_expires_in } = this.configService.get<JwtType>('jwt');
    const payload = { email };
    const token = this.jwtService.sign(payload, {
      secret: mail_secret,
      expiresIn: mail_expires_in,
    });

    const url = `${this.frontend_url}/auth/confirm?token=${token}`;

    return url;
  }

  forgotPasswordURL(email: string): string {
    const { password_secret, password_expires_in } = this.configService.get<JwtType>('jwt');
    const payload = { email };
    const token = this.jwtService.sign(payload, {
      secret: password_secret,
      expiresIn: password_expires_in,
    });

    const url = `${this.frontend_url}/auth/reset-password?token=${token}`;

    return url;
  }
}
