export const CreateUserMessages = {
  email: {
    required: 'email is required',
    invalid: 'invalid email',
  },
  password: {
    required: 'password is required',
    minLength: 'password must be at least 6 characters long',
    maxLength: 'password must be less than 12 characters long',
  },
  name: {
    required: 'name is required',
    minLength: 'name must be at least 1 character long',
    maxLength: 'name must be less than 15 characters long',
  },
  userType: {
    invalid: 'invalid userType',
  },
};
