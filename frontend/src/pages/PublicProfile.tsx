import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PostCard, { Post } from '../components/PostCard';
import { API_URL } from '../constants/env';

type PublicUser = { username: string; name: string; profilePicture?: string; createdAt: string };

export default function PublicProfile() {
  const { username = '' } = useParams();
  const [user, setUser] = useState<PublicUser | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const api = API_URL;

  useEffect(() => {
    document.title = `${username} • SocialGram`;
    const load = async () => {
      try {
        const [uRes, pRes] = await Promise.all([
          fetch(`${api}/api/users/${username}`),
          fetch(`${api}/api/users/${username}/posts`),
        ]);
        if (!uRes.ok) throw new Error('User not found');
        const u = await uRes.json();
        const p = await pRes.json();
        setUser(u.user);
        setPosts(p.posts || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [username]);

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
