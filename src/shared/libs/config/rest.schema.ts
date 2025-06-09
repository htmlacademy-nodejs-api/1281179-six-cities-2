import convict from 'convict';
import validator from 'convict-format-with-validator';

export type RestSchema = {
  PORT: string;
  SALT: string;
  DB_HOST: string;
}

convict.addFormats(validator);

export const configRestSchema = convict<RestSchema>({
  PORT: {
    doc: 'The port to bind.',
    format: 'port',
    default: '3000',
    env: 'PORT',
  },
  SALT: {
    doc: 'The salt for password hash',
    format: String,
    env: 'SALT',
    default: null
  },
  DB_HOST: {
    doc: 'IP address of the database server (MongoDB)',
    format: 'ipaddress',
    env: 'DB_HOST',
    default: '127.0.0.1'
  }
});
