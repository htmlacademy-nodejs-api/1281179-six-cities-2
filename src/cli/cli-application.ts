import {Command} from './commands/command.interface.js';

type CommandCollection = Record<string, Command>

export class CLIApplication {
  private commands: CommandCollection = {};

  public registerCommands(commands: Command[]) {
    commands.forEach((command) => {
      const commandName = command.getName();
      if (Object.hasOwn(this.commands, commandName)) {
        throw new Error(`Command ${command.getName()} is already registered`);
      }

      this.commands[commandName] = command;
    });
  }
}
