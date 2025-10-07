import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IComment {
  user: Types.ObjectId;
  text: string;
  createdAt: Date;
}

export interface IPost extends Document {
  author: Types.ObjectId;
  caption: string;
  imageUrl: string;
  likes: Types.ObjectId[];
  comments: IComment[];
  createdAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true, trim: true, maxlength: 500 },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const PostSchema = new Schema<IPost>(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    caption: { type: String, required: true, trim: true, maxlength: 280 },
    imageUrl: { type: String, required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    comments: { type: [CommentSchema], default: [] },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Post = mongoose.model<IPost>('Post', PostSchema);

