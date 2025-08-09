import { Command } from './commands/command.interface.js';
import { CommandParser } from './command-parser.js';

type CommandCollection = Record<string, Command>;

export class CLIApplication {
  private commands: CommandCollection = {};

  constructor(private readonly defaultCommand: string = '--help') {}

  public getCommand(commandName: string) {
    return this.commands[commandName] || this.getDefaultCommand();
  }

  public registerCommands(commands: Command[]) {
    commands.forEach((command) => {
      const commandName = command.getName();
      if (Object.hasOwn(this.commands, commandName)) {
        throw new Error(`Command ${command.getName()} is already registered`);
      }

      this.commands[commandName] = command;
    });
  }

  public processCommand(params: string[]): void {
    const parsedCommands = CommandParser.parse(params);
    const commandName = Object.keys(parsedCommands)[0];

    const command = this.getCommand(commandName);
    const commandParams = parsedCommands[commandName] || [];
    command.execute(...commandParams);
  }

  private getDefaultCommand(): never | Command {
    if (!this.commands[this.defaultCommand]) {
      throw new Error(
        `The default command ${this.defaultCommand} is not registered`
      );
    }

    return this.commands[this.defaultCommand];
  }
}
