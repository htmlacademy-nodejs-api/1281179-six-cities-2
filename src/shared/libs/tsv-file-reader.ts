import {FileReader} from './file-reader.interface.js';
import EventEmitter from 'node:events';
import {createReadStream} from 'node:fs';

const CHUNK_SIZE = 16384; // 16KB

export class TsvFileReader extends EventEmitter implements FileReader {
  constructor(
    private readonly filePath: string
  ) {
    super();
  }

  /**
   * @description В данном методе мы считываем содержимое мокового файла с помощью Stream. Это позволит считывать файлы
   * большого размера асинхронно.
   */
  public async read(): Promise<void> {
    // Создаем stream для чтения файла с заданной кодировкой и размером чанка
    const readStream = createReadStream(this.filePath, {
      encoding: 'utf-8',
      highWaterMark: CHUNK_SIZE
    });

    // Переменная для хранения прочитанных данных в текущем чанке
    let remainingData = '';
    // Переменная для хранения нашедшейся строки
    let nextLinePosition = -1;
    // Переменная для хранения найденного количества строк
    let importedRowCount = 0;

    // Асинхронно итерируемся по каждому чанку данных из потока
    for await (const chunk of readStream) {
      // Записываем прочитанные данные текущего чанка
      remainingData = chunk.toString();

      // Обновляем оставшиеся данные текущим чанком
      while ((nextLinePosition = remainingData.indexOf('\n')) > -1) {
        // Извлекаем полную строку до символа новой строки
        const completeRaw = remainingData.slice(0, nextLinePosition);
        // Обновляем оставшиеся данные, удаляя обработанную строку и символ новой строки
        remainingData = remainingData.slice(++nextLinePosition);
        // Увеличиваем счетчик импортированных строк
        importedRowCount++;

        // Вызываем события чтения строки
        this.emit('line', completeRaw);
      }
    }

    // Вызываем события окончания чтения файла
    this.emit('end', importedRowCount);
  }
}
