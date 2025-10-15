import { useState } from 'react';
import { usePostLike } from '../hooks/usePostLike';
import { usePostComments } from '../hooks/usePostComments';
import { useRetweet } from '../hooks/useRetweet';
import { useBookmark } from '../hooks/useBookmark';
import { useAuth } from '../context/AuthContext';
import { usePostReplies } from '../hooks/usePostReplies';

type Author = { name: string; profilePicture?: string };
type Reply = { user: { name: string; profilePicture?: string } | string; text: string; createdAt: string };
type Comment = { _id?: string; user: { name: string; profilePicture?: string } | string; text: string; createdAt: string; replies?: Reply[] };
export interface Post {
  _id: string;
  author: Author;
  caption: string;
  imageUrl: string;
  likes: string[];
  retweets?: string[];
  comments: Comment[];
  createdAt: string;
}

export default function PostCard({ post: initial }: { post: Post }) {
  const [post, setPost] = useState<Post>(initial);
  const [showComments, setShowComments] = useState(false);
  const { liked, toggleLike } = usePostLike(post, setPost);
  const { commentText, setCommentText, submitComment } = usePostComments(post, setPost);
  const { retweeted, toggle: toggleRetweet } = useRetweet(post, setPost);
  const { bookmarked, toggle: toggleBookmark } = useBookmark(post);
  const { user } = useAuth();
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [quoteText, setQuoteText] = useState('');

  function renderCaption(text: string) {
    const parts = text.split(/(@[a-z0-9](?:[a-z0-9._]{1,18}[a-z0-9])?)/giu);
    return (
      <>
        {parts.map((p, i) => {
          if (p.startsWith('@')) {
            const name = p.slice(1);
            return (
              <a key={i} href={`/u/${encodeURIComponent(name)}`} className="text-blue-600 hover:underline">{p}</a>
            );
          }
          return <span key={i}>{p}</span>;
        })}
      </>
    );
  }
  const { openFor, setOpenFor, texts, setText, submit, submitting } = usePostReplies(post, setPost);

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
      {(() => {
        const anyPost: any = post as any;
        const src = anyPost.imageUrl || (anyPost.mediaUrls?.[0]) || (anyPost.quoteOf?.imageUrl) || (anyPost.quoteOf?.mediaUrls?.[0]);
        return src ? (
          <img src={src} alt={post.caption} className="w-full max-h-[600px] object-cover bg-gray-100" />
        ) : null;
      })()}
      <div className="p-3 flex flex-col gap-3">
        <div className="flex items-center gap-4 flex-wrap">
          <button onClick={toggleLike} className={`text-sm ${liked ? 'text-red-600' : 'text-gray-600'}`}>
            {liked ? '♥ Liked' : '♡ Like'}
          </button>
          <span className="text-sm text-gray-700">{post.likes?.length || 0} likes</span>
          <button onClick={toggleRetweet} className={`text-sm ${retweeted ? 'text-green-600' : 'text-gray-600'}`}>
            {retweeted ? '⟳ Retweeted' : '⟳ Retweet'}
          </button>
          <button onClick={() => setQuoteOpen((s) => !s)} className="text-sm text-gray-600">
            ✎ Quote
          </button>
          <button onClick={() => toggleBookmark(post._id)} className={`text-sm ${bookmarked ? 'text-amber-600' : 'text-gray-600'}`}>
            {bookmarked ? '★ Bookmarked' : '☆ Bookmark'}
          </button>
          <button onClick={() => setShowComments((s) => !s)} className="text-sm text-blue-600">
            {showComments ? 'Hide comments' : `View comments (${post.comments?.length || 0})`}
          </button>
        </div>
        {quoteOpen && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // fire and forget via fetch to avoid growing API surface; reuse createTweet endpoint on backend for quote
              fetch(`${window.location.origin}/api/tweets/${post._id}/quote`);
            }}
            className="flex gap-2"
          >
            <input
              className="flex-1 border rounded px-2 py-1 text-sm"
              placeholder="Write a quote…"
              value={quoteText}
              onChange={(e) => setQuoteText(e.target.value)}
              maxLength={280}
            />
            <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded" onClick={async (e) => {
              e.preventDefault();
              const token = localStorage.getItem('token') || undefined;
              try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/tweets/${post._id}/quote`, {
                  method: 'POST',
                  headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ text: quoteText }),
                });
                if (res.ok) {
                  setQuoteText('');
                  setQuoteOpen(false);
                }
              } catch {}
            }}>Post</button>
          </form>
        )}
        <p className="text-sm"><span className="font-semibold mr-2">Caption:</span>{renderCaption(post.caption)}</p>
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
                        >
                          Reply
                        </button>
                        {openFor === (c._id || String(i)) && (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              submit(c._id || String(i));
                            }}
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
