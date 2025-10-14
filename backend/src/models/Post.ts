import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IComment {
  user: Types.ObjectId;
  text: string;
  createdAt: Date;
  replies?: IReply[];
}

export interface IPost extends Document {
  author: Types.ObjectId;
  caption: string;
  imageUrl?: string;
  mediaUrls?: string[];
  likes: Types.ObjectId[];
  comments: IComment[];
  createdAt: Date;
}

export interface IReply {
  user: Types.ObjectId;
  text: string;
  createdAt: Date;
}

const ReplySchema = new Schema<IReply>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true, trim: true, maxlength: 500 },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const CommentSchema = new Schema<IComment>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true, trim: true, maxlength: 500 },
    createdAt: { type: Date, default: Date.now },
    replies: { type: [ReplySchema], default: [] },
  },
  { _id: true }
);

const PostSchema = new Schema<IPost>(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    caption: { type: String, required: true, trim: true, maxlength: 280 },
    imageUrl: { type: String },
    mediaUrls: { type: [String], default: [] },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    comments: { type: [CommentSchema], default: [] },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

PostSchema.index({ author: 1, createdAt: -1 });

export const Post = mongoose.model<IPost>('Post', PostSchema);
