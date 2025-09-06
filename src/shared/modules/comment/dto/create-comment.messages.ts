export const CreateCommentMessages = {
  text: {
    required: 'text is required',
    minLength: 'text must be at least 50 characters long',
  },
  offerId: {
    required: 'offerId is required',
    invalid: 'offerId is not a valid MongoDB ObjectId',
  },
  authorId: {
    required: 'authorId is required',
  },
};
