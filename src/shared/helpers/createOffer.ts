import {Cities, ConvenienceType, Offer, Property, UserType} from '../types/index.js';

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
    authorEmail,
    authorType,
    authorName,
    autorAvatar,
    commentCount,
    coordinates
  ] = offerData
    .trim()
    .split('\t');

  if (!coordinates) {
    console.log({offerData});
  }

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
    conveniences: conveniences.split(';') as ConvenienceType[],
    author: {
      email: authorEmail,
      name: authorName,
      userType: UserType[authorType as keyof typeof UserType],
      photo: autorAvatar
    },
    commentCount: Number(commentCount),
    coordinates: coordinates.split(';').map(Number) as [number, number],
  };
}
