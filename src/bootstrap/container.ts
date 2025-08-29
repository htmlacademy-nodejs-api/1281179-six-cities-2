import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';

import { Logger, PinoLogger } from '../shared/libs/logger/index.js';
import { Components } from '../shared/types/index.js';
import { RestSchema, Config, RestConfig } from '../shared/libs/config/index.js';
import { DatabaseClient, MongoDatabaseClient } from '../shared/libs/database-client/index.js';

import { UserEntity, UserModel, UserService, DefaultUserService } from '../shared/modules/user/index.js';
import { CityController, CityEntity, CityModel, CityService, DefaultCityService } from '../shared/modules/city/index.js';
import { CommentController, CommentEntity, CommentModel, CommentService, DefaultCommentService } from '../shared/modules/comment/index.js';
import { AppExceptionFilter, Controller, ExceptionFilter } from '../shared/libs/rest/index.js';
import { OfferController, OfferEntity, OfferModel, OfferService, DefaultOfferService } from '../shared/modules/offer/index.js';
import { RestApplication } from '../apps/rest/index.js';
import { UserController } from '../shared/modules/user/user.controller.js';
import { AuthExceptionFilter } from '../shared/modules/auth/auth-exception.filter.js';
import { DefaultAuthService } from '../shared/modules/auth/default-auth.service.js';
import { AuthService } from '../shared/modules/auth/auth-service.interface.js';

export function createContainer(): Container {
  const container = new Container();

  // Core
  container.bind<Logger>(Components.Logger).to(PinoLogger).inSingletonScope();
  container.bind<Config<RestSchema>>(Components.RestConfig).to(RestConfig).inSingletonScope();
  container.bind<RestApplication>(Components.RestApplication).to(RestApplication);
  container.bind<DatabaseClient>(Components.DatabaseClient).to(MongoDatabaseClient).inSingletonScope();

  // Users
  container.bind<UserService>(Components.UserService).to(DefaultUserService).inSingletonScope();
  container.bind<types.ModelType<UserEntity>>(Components.UserModel).toConstantValue(UserModel);

  // Cities
  container.bind<CityService>(Components.CityService).to(DefaultCityService).inSingletonScope();
  container.bind<types.ModelType<CityEntity>>(Components.CityModel).toConstantValue(CityModel);

  // Comments
  container.bind<CommentService>(Components.CommentService).to(DefaultCommentService).inSingletonScope();
  container.bind<types.ModelType<CommentEntity>>(Components.CommentModel).toConstantValue(CommentModel);

  // Offers
  container.bind<OfferService>(Components.OfferService).to(DefaultOfferService).inSingletonScope();
  container.bind<types.ModelType<OfferEntity>>(Components.OfferModel).toConstantValue(OfferModel);

  // Controllers
  container.bind<Controller>(Components.CityController).to(CityController).inSingletonScope();
  container.bind<Controller>(Components.OfferController).to(OfferController).inSingletonScope();
  container.bind<Controller>(Components.UserController).to(UserController).inSingletonScope();
  container.bind<Controller>(Components.CommentController).to(CommentController).inSingletonScope();

  // Filters
  container.bind<ExceptionFilter>(Components.ExceptionFilter).to(AppExceptionFilter).inSingletonScope();
  container.bind<ExceptionFilter>(Components.AuthExceptionFilter).to(AuthExceptionFilter).inSingletonScope();

  // Auth
  container.bind<AuthService>(Components.AuthService).to(DefaultAuthService).inSingletonScope();

  return container;
}


