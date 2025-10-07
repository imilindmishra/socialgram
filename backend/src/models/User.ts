import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  googleId: string;
  email: string;
  name: string;
  profilePicture?: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    googleId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, index: true },
    name: { type: String, required: true },
    profilePicture: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const User = mongoose.model<IUser>('User', UserSchema);

