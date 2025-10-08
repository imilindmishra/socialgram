import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import PostCard, { Post } from '../components/PostCard';

export default function Feed() {
  const { user, token } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Feed • SocialGram';
    const load = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/posts`, {
          headers: { Authorization: token ? `Bearer ${token}` : '' },
        });
        if (res.ok) {
          const data = await res.json();
          setPosts(data.posts || []);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p className="p-4">Loading…</p>;

  return (
    <div className="flex flex-col gap-4 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold">Hello, {user?.name || 'there'}!</h2>
      {posts.length === 0 ? (
        <p className="text-gray-600">No posts yet. Be the first to create one!</p>
      ) : (
        posts.map((p) => <PostCard key={p._id} post={p} />)
      )}
    </div>
  );
}
