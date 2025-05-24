import {Command} from './command.interface.js';
import {TsvFileReader} from '../../shared/libs/tsv-file-reader.js';

export class ImportCommand implements Command {
  private readonly commandName = '--import';

  public getName(): string {
    return this.commandName;
  }

  public async execute(...params: string[]): Promise<void> {
    const [filePath] = params;
    const fileReader = new TsvFileReader(filePath.trim());
    try {
      fileReader.read();
      console.log(fileReader.toArray());
    } catch (error) {
      if (!(error instanceof Error)) {
        throw error;
      }

      console.error(`Can not import data from file: ${filePath}`);
      console.error(`Details: ${error.message}`);
    }
  }

}
