import {Command} from './command.interface.js';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

type PackageJSONConfig = {
  version: string;
}

function isPackageJSONConfig(value: unknown): value is PackageJSONConfig {
  return typeof value === 'object' && value !== null && !Array.isArray(value) && Object.hasOwn(value, 'version');
}

export class VersionCommand implements Command {
  private readonly commandName = '--version';

  constructor(
    private readonly filePath: string = './package.json'
  ) {
  }

  public readVersion(): string {
    const jsonContent = readFileSync(resolve(this.filePath), 'utf-8');
    const importedContent: unknown = JSON.parse(jsonContent);

    if (!isPackageJSONConfig(importedContent)) {
      throw new Error('Failed to parse json content');
    }
    return importedContent.version;
  }

  getName(): string {
    return this.commandName;
  }

  public async execute(..._params: string[]): Promise<void> {
    try {
      const version = this.readVersion();
      console.log(version);
    } catch (error: unknown) {
      console.error(`Failed to read version from ${this.filePath}`);
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }
}
