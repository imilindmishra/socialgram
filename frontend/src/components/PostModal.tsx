import { useEffect, useState } from 'react';
import type { Post as PostType } from './PostCard';
import { usePostLike } from '../hooks/usePostLike';
import { usePostComments } from '../hooks/usePostComments';
import { usePostReplies } from '../hooks/usePostReplies';

export default function PostModal({ post: initial, onClose }: { post: PostType; onClose: () => void }) {
  const [post, setPost] = useState<PostType>(initial);
  const { liked, toggleLike } = usePostLike(post, setPost);
  const { commentText, setCommentText, submitComment } = usePostComments(post, setPost);
  const { openFor, setOpenFor, texts, setText, submit, submitting } = usePostReplies(post, setPost);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div role="dialog" aria-modal="true" className="relative z-10 bg-white rounded-md shadow-xl w-[min(95vw,1000px)] h-[min(90vh,720px)] flex overflow-hidden">
        <div className="flex-1 bg-black flex items-center justify-center">
          {(() => {
            const anyPost: any = post as any;
            const src = anyPost.imageUrl || (anyPost.mediaUrls?.[0]) || (anyPost.quoteOf?.imageUrl) || (anyPost.quoteOf?.mediaUrls?.[0]);
            return src ? (
              <img src={src} alt={post.caption} className="max-h-full max-w-full object-contain" />
            ) : (
              <div className="text-white/80 text-sm p-4">No media</div>
            );
          })()}
        </div>
        <div className="w-[380px] max-w-[50%] flex flex-col">
          <div className="flex items-center justify-between p-3 border-b">
            <div className="flex items-center gap-2">
              <img
                src={post.author?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.name || 'U')}`}
                alt={post.author?.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="text-sm font-medium">{post.author?.name}</div>
            </div>
            <button className="text-gray-500 hover:text-gray-700" onClick={onClose} aria-label="Close">✕</button>
          </div>
          <div className="px-3 py-2 border-b">
            <div className="text-sm"><span className="font-semibold mr-2">Caption:</span>{post.caption}</div>
          </div>
          <div className="px-3 py-2 border-b flex items-center gap-4">
            <button onClick={toggleLike} className={`text-sm ${liked ? 'text-red-600' : 'text-gray-600'}`}>{liked ? '♥ Liked' : '♡ Like'}</button>
            <span className="text-sm text-gray-700">{post.likes?.length || 0} likes</span>
          </div>
          <div className="flex-1 overflow-auto px-3 py-3">
            {post.comments?.length ? (
              <div className="flex flex-col gap-3">
                {post.comments.map((c, i) => (
                  <div key={c._id || i} className="flex flex-col gap-2">
                    <div className="flex items-start gap-2">
                      <img
                        src={typeof c.user === 'string' ? `https://ui-avatars.com/api/?name=?` : (c.user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.user.name)}`)}
                        alt={typeof c.user === 'string' ? 'User' : c.user.name}
                        className="w-6 h-6 rounded-full object-cover mt-0.5"
                      />
                      <div className="flex-1">
                        <div className="text-xs text-gray-600">
                          {typeof c.user === 'string' ? 'User' : c.user.name} • {new Date(c.createdAt).toLocaleString()}
                        </div>
                        <div className="text-sm">{c.text}</div>
                        <button
                          type="button"
                          className="text-xs text-blue-600 mt-1"
                          onClick={() => setOpenFor(openFor === (c._id || String(i)) ? null : (c._id || String(i)))}
                        >Reply</button>
                        {openFor === (c._id || String(i)) && (
                          <form
                            onSubmit={(e) => { e.preventDefault(); submit(c._id || String(i)); }}
                            className="mt-2 flex gap-2"
                          >
                            <input
                              className="flex-1 border rounded px-2 py-1 text-xs"
                              placeholder="Reply…"
                              value={texts[c._id || String(i)] || ''}
                              onChange={(e) => setText(c._id || String(i), e.target.value)}
                              maxLength={500}
                            />
                            <button disabled={!!submitting[c._id || String(i)]} className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                              {submitting[c._id || String(i)] ? 'Posting…' : 'Post'}
                            </button>
                          </form>
                        )}
                        {c.replies?.length ? (
                          <div className="mt-2 ml-6 flex flex-col gap-2">
                            {c.replies.map((r, ri) => (
                              <div key={ri} className="flex items-start gap-2">
                                <img
                                  src={typeof r.user === 'string' ? `https://ui-avatars.com/api/?name=?` : (r.user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.user.name)}`)}
                                  alt={typeof r.user === 'string' ? 'User' : r.user.name}
                                  className="w-5 h-5 rounded-full object-cover mt-0.5"
                                />
                                <div>
                                  <div className="text-xs text-gray-600">
                                    {typeof r.user === 'string' ? 'User' : r.user.name} • {new Date(r.createdAt).toLocaleString()}
                                  </div>
                                  <div className="text-sm">{r.text}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No comments yet.</p>
            )}
          </div>
          <form onSubmit={submitComment} className="p-3 border-t flex gap-2">
            <input
              className="flex-1 border rounded px-2 py-1 text-sm"
              placeholder="Add a comment…"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              maxLength={500}
            />
            <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded">Post</button>
          </form>
        </div>
      </div>
    </div>
  );
}
