import {Command} from './command.interface.js';
import {TsvFileReader} from '../../shared/libs/file-reader/tsv-file-reader.js';
import {createOffer} from '../../shared/helpers/index.js';
import {Offer} from '../../shared/types/index.js';

export class ImportCommand implements Command {
  private readonly offers: Offer[] = [];
  private readonly commandName = '--import';

  constructor() {
    this.handleLineEvent = this.handleLineEvent.bind(this);
  }

  public getName(): string {
    return this.commandName;
  }

  public async execute(...params: string[]): Promise<void> {
    const [filePath] = params;
    const fileReader = new TsvFileReader(filePath.trim());
    fileReader.on('line', this.handleLineEvent);
    fileReader.on('end', this.handleEndEvent);

    try {
      await fileReader.read();
    } catch (error) {
      if (!(error instanceof Error)) {
        throw error;
      }

      console.error(`Can not import data from file: ${filePath}`);
      console.error(`Details: ${error.message}`);
    }
  }

  private handleLineEvent(line: string): void {
    const offer = createOffer(line);
    this.offers.push(offer);
    console.info(offer);
  }

  private handleEndEvent(lineCount: string) {
    console.info(`${lineCount} rows imported`);
    console.info(this.offers);
  }
}
