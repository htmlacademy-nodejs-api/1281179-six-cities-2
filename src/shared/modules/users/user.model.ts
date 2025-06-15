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
  name: {
    type: String,
    required: true,
    minlength: 3
  },
  password: {
    type: String,
    required: true,
    minlength: 12,
  },
  photo: String,
}, {
  timestamps: true
});

export const UserModel = model<UserDocument>('User', userSchema);
