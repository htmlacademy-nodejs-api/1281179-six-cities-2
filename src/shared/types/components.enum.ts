export const Components = {
  RestApplication: Symbol.for('RestApplication'),
  Logger: Symbol.for('Logger'),
  RestConfig: Symbol.for('RestConfig'),
  DatabaseClient: Symbol.for('DatabaseClient'),
  UserService: Symbol.for('UserService'),
  UserModel: Symbol.for('UserModel'),
} as const;
