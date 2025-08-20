import convict from 'convict';
import validator from 'convict-format-with-validator';

export type RestSchema = {
  PORT: string;
  SALT: string;
  DB_HOST: string;
  DB_USERNAME: string;
  DB_PASSWORD: string
  DB_PORT: string;
  DB_NAME: string;
  UPLOAD_DIRECTORY: string;
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
  },
  DB_USERNAME: {
    doc: 'Username for connecting to the database',
    format: String,
    env: 'DB_USERNAME',
    default: null
  },
  DB_PASSWORD: {
    doc: 'Password for connecting to the database',
    format: String,
    env: 'DB_PASSWORD',
    default: null
  },
  DB_PORT: {
    doc: 'Port for connecting to the database',
    format: 'port',
    env: 'DB_PORT',
    default: '27017'
  },
  DB_NAME: {
    doc: 'Database name',
    format: String,
    env: 'DB_NAME',
    default: 'six-cities'
  },
  UPLOAD_DIRECTORY: {
    doc: 'Directory for uploading files',
    format: String,
    env: 'UPLOAD_DIRECTORY',
    default: 'upload'
  }
});
