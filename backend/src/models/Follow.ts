import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IFollow extends Document {
  follower: Types.ObjectId;
  followee: Types.ObjectId;
  createdAt: Date;
}

const FollowSchema = new Schema<IFollow>(
  {
    follower: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    followee: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

FollowSchema.index({ follower: 1, followee: 1 }, { unique: true });

export const Follow = mongoose.model<IFollow>('Follow', FollowSchema);

