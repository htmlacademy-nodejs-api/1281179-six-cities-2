import {FileWriter} from './file-writer.interface.js';
import {createWriteStream, WriteStream} from 'node:fs';

const CHUNK_SIZE = 16384; // 16KB

export class TsvFileWriter implements FileWriter {
  private readonly stream: WriteStream;

  constructor(
    private readonly path: string
  ) {
    this.stream = createWriteStream(this.path, {
      flags: 'w',
      encoding: 'utf-8',
      autoClose: true,
      highWaterMark: CHUNK_SIZE
    });
  }

  async write(row: string): Promise<void> {
    if (!this.stream.write(`${row}\n`)) {
      await new Promise((resolve) => {
        this.stream.on('drain', resolve);
      });
    }
  }
}
