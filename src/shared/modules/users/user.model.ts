import { Document, model, Schema } from 'mongoose';
import type { User } from '../../types/index.js';

export interface UserDocument extends User, Document {}

const userSchema = new Schema({
  email: {
    unique: true,
    type: String,
  },
  name: String,
  password: String,
  photo: String,
});

export const UserModel = model<UserDocument>('User', userSchema);
