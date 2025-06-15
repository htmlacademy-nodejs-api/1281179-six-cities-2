import { Document, model, Schema } from 'mongoose';
import type { User } from '../../types/index.js';

export interface UserDocument extends User, Document {
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema({
  email: {
    unique: true,
    type: String,
  },
  name: String,
  password: String,
  photo: String,
}, {
  timestamps: true
});

export const UserModel = model<UserDocument>('User', userSchema);
