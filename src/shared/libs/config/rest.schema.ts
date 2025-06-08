import convict from 'convict';

type RestSchema = {
  PORT: string;
}

export const configRestSchema = convict<RestSchema>({
  PORT: {
    doc: 'The port to bind.',
    format: 'port',
    default: '3000',
    env: 'PORT',
  }
});
