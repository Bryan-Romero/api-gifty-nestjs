import * as Joi from 'joi';
import { Role } from 'src/common/enums';

import { NodeEnv } from './node-env.enum';

export const validationSchema = Joi.object({
  // api
  NODE_ENV: Joi.string().valid(...Object.values(NodeEnv)),
  PORT: Joi.number().default(4000),
  API_KEY: Joi.string().required(),
  PREFIX: Joi.string().required(),
  FRONTEND_URL: Joi.string().required(),

  // jwt
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().required(),
  REFRESH_JWT_SECRET: Joi.string().required(),
  REFRESH_JWT_EXPIRES_IN: Joi.string().required(),
  MAIL_JWT_SECRET: Joi.string().required(),
  MAIL_JWT_EXPIRES_IN: Joi.string().required(),
  PASSWORD_JWT_SECRET: Joi.string().required(),
  PASSWORD_JWT_EXPIRES_IN: Joi.string().required(),

  // database
  DATABASE_URI: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),

  // default user
  DEFAULT_USER_NAME: Joi.string().required(),
  DEFAULT_USER_ROLE: Joi.string().valid(...Object.values(Role)),
  DEFAULT_USER_EMAIL: Joi.string().email(),
  DEFAULT_USER_PASSWORD: Joi.string().required(),

  // mail
  MAIL_HOST: Joi.string().required(),
  MAIL_USER: Joi.string().required(),
  MAIL_PASSWORD: Joi.string().required(),
  MAIL_FROM: Joi.string().required(),
  MAIL_PORT: Joi.number().required(),
  MAIL_BREVO_API_KEY: Joi.string().required(),

  // bcryptjs
  BCRYPTJS_SALT_ROUNDS: Joi.number().default(10),
});
