import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IBookmark extends Document {
  user: Types.ObjectId;
  tweet: Types.ObjectId;
  createdAt: Date;
}

const BookmarkSchema = new Schema<IBookmark>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tweet: { type: Schema.Types.ObjectId, ref: 'Post', required: true, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

BookmarkSchema.index({ user: 1, tweet: 1 }, { unique: true });

export const Bookmark = mongoose.model<IBookmark>('Bookmark', BookmarkSchema);

