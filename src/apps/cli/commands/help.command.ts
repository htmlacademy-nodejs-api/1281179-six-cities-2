import {Command} from './command.interface.js';
import chalk from 'chalk';

export class HelpCommand implements Command {
  private readonly commandName: string = '--help';

  getName(): string {
    return this.commandName;
  }

  execute(..._params: string[]): void {
    console.info(`
      Программа для подготовки данных для REST API сервера.

      Пример: ${chalk.bgGrey('main.cli.js --<command> [--arguments]')}

      Команды:

       ${chalk.green.bold('--version:')}                   # выводит номер версии
       ${chalk.green.bold('--help:')}                      # печатает этот текст
       ${chalk.green.bold('--import <path>:')}             # импортирует данные из TSV
       ${chalk.green.bold('--generate <n> <path> <url>:')} # генерирует произвольное количество тестовых данных
    `);
  }
}
