import { Logger as PinoInstanse, pino, transport } from 'pino';
import { Logger } from './logger.interface.js';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export class PinoLogger implements Logger {
  private readonly logger: PinoInstanse;

  constructor() {
    // Получаем путь к текущему файлу
    const __fileName = fileURLToPath(import.meta.url);

    // Получаем директорию текущего файла
    const __dirName = dirname(__fileName);

    // Получаем путь к файлу логов
    const destination = resolve(__dirName, '../../../../', 'logs/app.log');
    const pinoTransport = transport({
      target: 'pino/file',
      options: {
        destination
      }
    });

    this.logger = pino({}, pinoTransport);
  }

  info(message: string, ...args: unknown[]): void {
    this.logger.info(message, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    this.logger.warn(message, ...args);
  }

  error(message: string, ...args: unknown[]): void {
    this.logger.error(message, ...args);
  }

  debug(message: string, ...args: unknown[]): void {
    this.logger.debug(message, ...args);
  }
}
