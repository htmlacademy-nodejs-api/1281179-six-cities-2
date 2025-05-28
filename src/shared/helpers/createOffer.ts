import {Cities, Convenience, Offer, Property} from '../types/index.js';

export function createOffer(offerData: string): Offer {
  const [
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
  ] = offerData
    .trim()
    .split('\t');

  return {
    name,
    description,
    publicationDate,
    city: city as Cities,
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
    author: Number(author),
    commentCount: Number(commentCount),
    coordinates: coordinates.split(';').map(Number) as [number, number],
  };
}
