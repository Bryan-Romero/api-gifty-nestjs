import { Role } from 'src/common/enums';

export interface ConfigurationType {
  node_env: string;
  port: number;
  prefix: string;
  api_key: string;
  frontend_url: string;
  database: DatabaseType;
  default_user: DefaultUserType;
  jwt: JwtType;
  mail: MailType;
  bcryptjs_salt_rounds: number;
}

export interface DatabaseType {
  db_uri: string;
  db_name: string;
}

export interface DefaultUserType {
  username: string;
  role: Role;
  email: string;
  password: string;
}

export interface JwtType {
  secret: string;
  expires_in: string;
  refresh_secret: string;
  refresh_expires_in: string;
  mail_secret: string;
  mail_expires_in: string;
  password_secret: string;
  password_expires_in: string;
}

export interface MailType {
  host: string;
  user: string;
  password: string;
  from: string;
  port: number;
  brevo_api_key: string;
}
