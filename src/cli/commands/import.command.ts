import {Command} from './command.interface.js';

export class ImportCommand implements Command {
  private readonly commandName = '--import';

  public getName(): string {
    return this.commandName;
  }

  public async execute(..._params: string[]): Promise<void> {
    // Read file
  }

}
