type ParsedCommand = Record<string, string[]>

export class CommandParser {
  /**
   * Парсит массив аргументов командной строки в структурированный объект.
   * Каждый флаг команды (начинающийся с "--") является ключом в возвращаемом объекте.
   * А значения, связанные с ключом, это массив переданных аргументов.
   * @param cliArguments
   * @returns Объект, где ключ - флаг команды, а значение - массив аргументов, следующий за этим флагом.
   * @example
   * const args = ['--import', './mocks/offers.tsv'];
   * const parsed = CommandParser.parse(args); // parsed будет соответствовать {'--import': ['./mocks/offers.tsv']}
   *
   */
  static parse(cliArguments: string[]) {
    const parsedCommand: ParsedCommand = {};
    let currentCommand = '';

    for (const argument of cliArguments) {
      if (argument.startsWith('--')) {
        parsedCommand[argument] = [];
        currentCommand = argument;
      } else if (currentCommand && argument) {
        parsedCommand[currentCommand].push(argument);
      }
    }

    return parsedCommand;
  }
}
