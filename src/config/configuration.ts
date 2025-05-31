import { Role } from 'src/common/enums';
import { ConfigurationType } from './configuration.interface';

export const configuration = (): ConfigurationType => ({
  node_env: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10),
  prefix: process.env.PREFIX,
  api_key: process.env.API_KEY,
  frontend_url: process.env.FRONTEND_URL,
  jwt: {
    secret: process.env.JWT_SECRET,
    expires_in: process.env.JWT_EXPIRES_IN,
    refresh_secret: process.env.REFRESH_JWT_SECRET,
    refresh_expires_in: process.env.REFRESH_JWT_EXPIRES_IN,
    mail_secret: process.env.MAIL_JWT_SECRET,
    mail_expires_in: process.env.MAIL_JWT_EXPIRES_IN,
    password_secret: process.env.PASSWORD_JWT_SECRET,
    password_expires_in: process.env.PASSWORD_JWT_EXPIRES_IN,
  },
  database: {
    db_uri: process.env.DATABASE_URI,
    db_name: process.env.DATABASE_NAME,
  },
  default_user: {
    username: process.env.DEFAULT_USER_NAME,
    role: process.env.DEFAULT_USER_ROLE as Role,
    email: process.env.DEFAULT_USER_EMAIL,
    password: process.env.DEFAULT_USER_PASSWORD,
  },
  mail: {
    host: process.env.MAIL_HOST,
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
    from: process.env.MAIL_FROM,
    port: parseInt(process.env.MAIL_PORT, 10),
  },
  bcryptjs_salt_rounds: parseInt(process.env.BCRYPTJS_SALT_ROUNDS, 10),
});

// https://dev.to/pitops/managing-multiple-environments-in-nestjs-71l
