import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import {
  ConfigurationType,
  MailType,
} from 'src/config/configuration.interface';
import { MailService } from './mail.service';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService<ConfigurationType>) => {
        const mail = config.get<MailType>('mail');
        return {
          transport: {
            host: mail.host,
            port: mail.port,
            secure: mail.host === '465', // Cambiar a true si usas el puerto 465
            socketTimeout: 60000, // 60 segundos
            auth: {
              user: mail.user,
              pass: mail.password,
            },
          },
          tls: {
            rejectUnauthorized: false, // Evita problemas con certificados
          },
          defaults: {
            from: `"GIFty" <${mail.from}>`,
          },
          template: {
            dir: join(process.cwd(), '/static/templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}

// https://notiz.dev/blog/send-emails-with-nestjs
// https://nest-modules.github.io/mailer/docs/mailer
