import React from 'react';
import type { Post } from '../PostCard';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

export default function PostCardView({
  post,
  liked,
  likeCount,
  showComments,
  onToggleLike,
  onToggleComments,
  commentText,
  onCommentTextChange,
  onSubmitComment,
}: {
  post: Post;
  liked: boolean;
  likeCount: number;
  showComments: boolean;
  onToggleLike: () => void;
  onToggleComments: () => void;
  commentText: string;
  onCommentTextChange: (v: string) => void;
  onSubmitComment: () => void;
}) {
  return (
    <article className="bg-white border rounded-md overflow-hidden">
      <header className="flex items-center gap-3 p-3">
        <img
          src={post.author?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.name || 'U')}`}
          alt={post.author?.name}
          className="w-8 h-8 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <span className="text-sm font-medium">{post.author?.name || 'Unknown'}</span>
          <span className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</span>
        </div>
      </header>
      <img src={post.imageUrl} alt={post.caption} className="w-full max-h-[600px] object-cover bg-gray-100" />
      <div className="p-3 flex flex-col gap-3">
        <div className="flex items-center gap-4">
          <button onClick={onToggleLike} className={`text-sm ${liked ? 'text-red-600' : 'text-gray-600'}`}>
            {liked ? '♥ Liked' : '♡ Like'}
          </button>
          <span className="text-sm text-gray-700">{likeCount} likes</span>
          <button onClick={onToggleComments} className="text-sm text-blue-600">
            {showComments ? 'Hide comments' : `View comments (${post.comments?.length || 0})`}
          </button>
        </div>
        <p className="text-sm"><span className="font-semibold mr-2">Caption:</span>{post.caption}</p>
        {showComments && (
          <div className="border-t pt-3 flex flex-col gap-3">
            <CommentForm
              value={commentText}
              onChange={onCommentTextChange}
              onSubmit={onSubmitComment}
            />
            <CommentList comments={post.comments as any} />
          </div>
        )}
      </div>
    </article>
  );
}

