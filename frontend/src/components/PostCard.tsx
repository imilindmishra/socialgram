import { useState } from 'react';
import { usePostLike } from '../hooks/usePostLike';
import { usePostComments } from '../hooks/usePostComments';

type Author = { name: string; profilePicture?: string };
type Comment = { user: { name: string; profilePicture?: string } | string; text: string; createdAt: string };
export interface Post {
  _id: string;
  author: Author;
  caption: string;
  imageUrl: string;
  likes: string[];
  comments: Comment[];
  createdAt: string;
}

export default function PostCard({ post: initial }: { post: Post }) {
  const [post, setPost] = useState<Post>(initial);
  const [showComments, setShowComments] = useState(false);
  const { liked, toggleLike } = usePostLike(post, setPost);
  const { commentText, setCommentText, submitComment } = usePostComments(post, setPost);

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
          <button onClick={toggleLike} className={`text-sm ${liked ? 'text-red-600' : 'text-gray-600'}`}>
            {liked ? '♥ Liked' : '♡ Like'}
          </button>
          <span className="text-sm text-gray-700">{post.likes?.length || 0} likes</span>
          <button onClick={() => setShowComments((s) => !s)} className="text-sm text-blue-600">
            {showComments ? 'Hide comments' : `View comments (${post.comments?.length || 0})`}
          </button>
        </div>
        <p className="text-sm"><span className="font-semibold mr-2">Caption:</span>{post.caption}</p>
        {showComments && (
          <div className="border-t pt-3 flex flex-col gap-3">
            <form onSubmit={submitComment} className="flex gap-2">
              <input
                className="flex-1 border rounded px-2 py-1 text-sm"
                placeholder="Add a comment…"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                maxLength={500}
              />
              <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded">Post</button>
            </form>
            <div className="flex flex-col gap-2">
              {post.comments?.length ? (
                post.comments.map((c, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <img
                      src={typeof c.user === 'string' ? `https://ui-avatars.com/api/?name=?` : (c.user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.user.name)}`)}
                      alt={typeof c.user === 'string' ? 'User' : c.user.name}
                      className="w-6 h-6 rounded-full object-cover mt-0.5"
                    />
                    <div>
                      <div className="text-xs text-gray-600">
                        {typeof c.user === 'string' ? 'User' : c.user.name} • {new Date(c.createdAt).toLocaleString()}
                      </div>
                      <div className="text-sm">{c.text}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No comments yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
