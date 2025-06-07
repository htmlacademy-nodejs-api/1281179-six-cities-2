#!/usr/bin/env node
import { RestApplication } from './apps/rest/index.js';
import { RestConfig } from './shared/libs/config/rest.config.js';
import { PinoLogger } from './shared/libs/logger/index.js';

function bootstrap() {
  const logger = new PinoLogger();
  const restConfig = new RestConfig(logger);

  const restApp = new RestApplication(logger, restConfig);
  restApp.init();
}

bootstrap();
