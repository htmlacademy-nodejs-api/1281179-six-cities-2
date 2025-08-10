#!/usr/bin/env node
import 'reflect-metadata';
import { Container } from 'inversify';
import { RestApplication } from './apps/rest/index.js';
import { Components } from './shared/types/index.js';
import { createContainer } from './bootstrap/container.js';

function bootstrap() {
  const container: Container = createContainer();

  const restApp = container.get<RestApplication>(Components.RestApplication);
  restApp.init();
}

bootstrap();
