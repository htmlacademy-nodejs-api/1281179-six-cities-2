export const CreateOfferMessages = {
  name: {
    minLength: 'min length is 10, max length is 100',
    maxLength: 'min length is 10, max length is 100',
    required: 'name is required',
  },
  description: {
    minLength: 'min length is 10, max length is 1024',
    maxLength: 'min length is 10, max length is 1024',
    required: 'description is required',
  },
  city: {
    invalid: 'invalid city',
  },
  previewImage: {
    required: 'previewImage is required',
  },
  photos: {
    required: 'photos is required',
  },
  isPremium: {
    required: 'isPremium is required',
  },
  isFavorite: {
    required: 'isFavorite is required',
  },
  rating: {
    required: 'rating is required',
  },
  type: {
    invalid: 'invalid property',
  },
  roomCount: {
    required: 'roomCount is required',
    min: 'roomCount must be greater than 0',
  },
  guestCount: {
    required: 'guestCount is required',
    min: 'guestCount must be greater than 0',
  },
  cost: {
    required: 'cost is required',
    min: 'cost must be greater than 0',
  },
  conveniences: {
    required: 'conveniences is required',
    each: 'each convenience must be a valid type',
  },
  author: {
    required: 'author is required',
  },
  coordinates: {
    required: 'coordinates is required',
    length: 'coordinates must be an array of 2 numbers',
  },
};
