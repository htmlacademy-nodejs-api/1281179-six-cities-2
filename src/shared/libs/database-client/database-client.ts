import { inject, injectable } from 'inversify';
import { Logger } from '../logger/logger.interface.js';
import { DatabaseClient } from './database-client.interface.js';
import { Components } from '../../types/components.enum.js';
import * as Mongoose from 'mongoose';

@injectable()
export class MongoDatabaseClient implements DatabaseClient {
  private mongoose?: typeof Mongoose;
  private _isConnected = false;

  constructor(
    @inject(Components.Logger) private readonly logger: Logger
  ) {}

  public get isConnectedToDatabase(): boolean {
    return this._isConnected;
  }

  public set isConnectedToDatabase(value: boolean) {
    this._isConnected = value;
  }

  public async connect(uri: string): Promise<void> {
    this.logger.info(`Connecting to ${uri}`);

    if (this.isConnectedToDatabase) {
      this.logger.info(`Already connected to ${uri}`);
      return;
    }

    try {
      this.mongoose = await Mongoose.connect(uri);
      this.isConnectedToDatabase = true;
      this.logger.info(`Successfully connected to ${uri}`);
    } catch (error) {
      this.logger.error(`Error connecting to ${uri}: ${error}`);
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnectedToDatabase || !this.mongoose) {
      this.logger.error('Not connected to the database');
      return;
    }

    try {
      await this.mongoose?.disconnect();
      this.isConnectedToDatabase = false;
      this.logger.info('Disconnected from the database');
    } catch (error) {
      this.logger.error(`Error disconnecting from the database: ${error}`);
    }
  }
}
