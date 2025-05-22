import {Command} from './command.interface.js';

export class HelpCommand implements Command {
  private readonly commandName: string = '--help';

  getName(): string {
    return this.commandName;
  }

  execute(..._params: string[]): void {
    console.info(`
      Программа для подготовки данных для REST API сервера.

      Пример: cli.js --<command> [--arguments]

      Команды:

       --version:                   # выводит номер версии
       --help:                      # печатает этот текст
       --import <path>:             # импортирует данные из TSV
       --generate <n> <path> <url>  # генерирует произвольное количество тестовых данных
    `);
  }
}
