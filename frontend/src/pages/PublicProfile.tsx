import { useParams } from 'react-router-dom';
import type { Post } from '../components/PostCard';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { usePublicProfile } from '../hooks/usePublicProfile';
import { useState } from 'react';
import PostModal from '../components/PostModal';
import { useAuth } from '../context/AuthContext';
import { useFollow } from '../hooks/useFollow';

export default function PublicProfile() {
  const { username = '' } = useParams();
  useDocumentTitle(`${username} • SocialGram`);
  const { user, posts, loading, error } = usePublicProfile(username);
  const [selected, setSelected] = useState<Post | null>(null);
  const { user: me } = useAuth();
  const { following, loading: followLoading, toggle } = useFollow(username);

  if (loading) return <p className="p-4">Loading…</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (!user) return <p className="p-4">User not found.</p>;

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      <header className="flex items-center gap-3">
        <img
          src={user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
          alt={user.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="text-lg font-semibold">{user.name}</div>
          <div className="text-sm text-gray-600">@{user.username}</div>
        </div>
        {me?.username && me.username !== user.username && (
          <button
            disabled={followLoading}
            onClick={toggle}
            className={`text-sm px-3 py-1 rounded border ${following ? 'bg-gray-100 text-gray-800' : 'bg-blue-600 text-white'}`}
          >
            {following ? 'Following' : 'Follow'}
          </button>
        )}
      </header>
      {posts.length ? (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
          {posts.map((p) => {
            const anyP: any = p as any;
            const src = anyP.imageUrl || (anyP.mediaUrls && anyP.mediaUrls[0]) || (anyP.quoteOf && (anyP.quoteOf.imageUrl || (anyP.quoteOf.mediaUrls && anyP.quoteOf.mediaUrls[0])));
            return (
              <button key={p._id} className="relative aspect-square overflow-hidden rounded group" onClick={() => setSelected(p)}>
                {src ? (
                  <img src={src} alt={p.caption} className="h-full w-full object-cover group-hover:opacity-95" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gray-100 text-xs p-2 text-gray-600">{p.caption}</div>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-600">No posts yet.</p>
      )}
      {selected && <PostModal post={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
