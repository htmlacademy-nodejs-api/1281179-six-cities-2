#!/usr/bin/env node
import 'reflect-metadata';
import { Container } from 'inversify';
import { RestApplication } from './apps/rest/index.js';
import { RestConfig } from './shared/libs/config/rest.config.js';
import { Logger, PinoLogger } from './shared/libs/logger/index.js';
import { Components } from './shared/types/components.enum.js';
import { RestSchema } from './shared/libs/config/rest.schema.js';
import { Config } from './shared/libs/config/config.interface.js';
import { DatabaseClient, MongoDatabaseClient } from './shared/libs/database-client/index.js';

function bootstrap() {
  const container = new Container();
  container.bind<Logger>(Components.Logger).to(PinoLogger).inSingletonScope();
  container.bind<Config<RestSchema>>(Components.RestConfig).to(RestConfig).inSingletonScope();
  container.bind<RestApplication>(Components.RestApplication).to(RestApplication);
  container.bind<DatabaseClient>(Components.DatabaseClient).to(MongoDatabaseClient).inSingletonScope();

  const restApp = container.get<RestApplication>(Components.RestApplication);
  restApp.init();
}

bootstrap();
