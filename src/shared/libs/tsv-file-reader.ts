import {FileReader} from './file-reader.interface.js';
import {readFileSync} from 'node:fs';
import {Convenience, Offer, Property} from '../types/index.js';

export class TsvFileReader implements FileReader {
  private rawData = '';

  constructor(
    private readonly filePath: string
  ) {
  }

  public read(): void {
    this.rawData = readFileSync(this.filePath, 'utf-8');
  }

  public toArray(): Offer[] {
    if (!this.rawData) {
      throw new Error('File did not read');
    }
    // TODO: Добавить type predicate для данных из интернета
    return this.rawData
      .trim()
      .split('\n')
      .map((offer) => offer.split('\t'))
      .map(([
        name,
        description,
        publicationDate,
        city,
        previewImage,
        photos,
        isPremium,
        isFavorite,
        rating,
        type,
        roomCount,
        guestCount,
        cost,
        conveniences,
        author,
        commentCount,
        coordinates
      ]) => ({
        name,
        description,
        publicationDate,
        city,
        previewImage,
        photos: photos.split(';'),
        isPremium: JSON.parse(isPremium),
        isFavorite: JSON.parse(isFavorite),
        rating: Number(rating),
        type: Property[type.toUpperCase() as keyof typeof Property],
        roomCount: Number(roomCount),
        guestCount: Number(guestCount),
        cost: Number(cost),
        conveniences: conveniences.split(';') as Convenience[],
        author,
        commentCount: Number(commentCount),
        coordinates: coordinates.split(';').map(Number) as [number, number],
      }));
  }

}
