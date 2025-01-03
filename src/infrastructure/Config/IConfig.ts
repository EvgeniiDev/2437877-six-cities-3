export interface IConfig {
  env: string;
  port: number;
  dbip: string;
  salt: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_PORT: string;
  DB_NAME: string;
  UPLOAD_DIR: string;
  JWT_SECRET: string;
}
