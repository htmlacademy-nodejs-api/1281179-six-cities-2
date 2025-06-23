import { setTimeout } from 'node:timers/promises';
import { inject, injectable } from 'inversify';
import { Logger } from '../logger/logger.interface.js';
import { DatabaseClient } from './database-client.interface.js';
import { Components } from '../../types/components.enum.js';
import * as Mongoose from 'mongoose';

@injectable()
export class MongoDatabaseClient implements DatabaseClient {
  private readonly MAX_ATTEMPTS = 5;
  private readonly ATTEMPT_DELAY = 1000;
  private mongoose?: typeof Mongoose;
  private _isConnected = false;
  private attempts = 0;

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
    if (this.isConnectedToDatabase) {
      this.logger.info(`Already connected to ${uri}`);
      return;
    }

    this.logger.info(`Connecting to ${uri}`);

    while (this.attempts < this.MAX_ATTEMPTS) {
      try {
        this.mongoose = await Mongoose.connect(uri);
        this.isConnectedToDatabase = true;
        this.logger.info(`Successfully connected to ${uri}`);
        return;
      } catch (error) {
        this.attempts++;
        if (this.attempts === this.MAX_ATTEMPTS) {
          this.logger.error(`Failed to connect to ${uri} after ${this.MAX_ATTEMPTS} attempts`);
          throw new Error(`Failed to connect to ${uri} after ${this.MAX_ATTEMPTS} attempts`);
        }
        this.logger.error(`Error connecting to ${uri}: ${error}. Retrying attempt ${this.attempts}`);
        await setTimeout(this.ATTEMPT_DELAY);
      }
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
      this.attempts = 0;
      this.logger.info('Disconnected from the database');
    } catch (error) {
      this.logger.error(`Error disconnecting from the database: ${error}`);
    }
  }
}
