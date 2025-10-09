import { useParams } from 'react-router-dom';
import PostCard from '../components/PostCard';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { usePublicProfile } from '../hooks/usePublicProfile';

export default function PublicProfile() {
  const { username = '' } = useParams();
  useDocumentTitle(`${username} • SocialGram`);
  const { user, posts, loading, error } = usePublicProfile(username);

  if (loading) return <p className="p-4">Loading…</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (!user) return <p className="p-4">User not found.</p>;

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-4">
      <header className="flex items-center gap-3">
        <img
          src={user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
          alt={user.name}
          className="w-14 h-14 rounded-full object-cover"
        />
        <div>
          <div className="text-lg font-semibold">{user.name}</div>
          <div className="text-sm text-gray-600">@{user.username}</div>
        </div>
      </header>
      {posts.length ? posts.map((p) => <PostCard key={p._id} post={p} />) : <p className="text-gray-600">No posts yet.</p>}
    </div>
  );
}
