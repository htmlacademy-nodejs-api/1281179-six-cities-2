#!/usr/bin/env node
import { RestApplication } from './apps/rest/index.js';
import { PinoLogger } from './shared/libs/logger/index.js';

function bootstrap() {
  const logger = new PinoLogger();
  const restApp = new RestApplication(logger);
  restApp.init();
}

bootstrap();
