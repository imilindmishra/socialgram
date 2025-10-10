import { useParams } from 'react-router-dom';
import type { Post } from '../components/PostCard';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { usePublicProfile } from '../hooks/usePublicProfile';
import { useState } from 'react';
import PostModal from '../components/PostModal';

export default function PublicProfile() {
  const { username = '' } = useParams();
  useDocumentTitle(`${username} • SocialGram`);
  const { user, posts, loading, error } = usePublicProfile(username);
  const [selected, setSelected] = useState<Post | null>(null);

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
        <div>
          <div className="text-lg font-semibold">{user.name}</div>
          <div className="text-sm text-gray-600">@{user.username}</div>
        </div>
      </header>
      {posts.length ? (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
          {posts.map((p) => (
            <button key={p._id} className="relative aspect-square overflow-hidden rounded group" onClick={() => setSelected(p)}>
              <img src={p.imageUrl} alt={p.caption} className="h-full w-full object-cover group-hover:opacity-95" />
            </button>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No posts yet.</p>
      )}
      {selected && <PostModal post={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
