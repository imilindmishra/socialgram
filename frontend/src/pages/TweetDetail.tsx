import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTweet } from '../lib/api';
import PostCard, { Post } from '../components/PostCard';

export default function TweetDetail() {
  const { id = '' } = useParams();
  const { token } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const res = await getTweet(token || undefined, id);
        if (!res.ok) throw new Error('Not found');
        const data = await res.json();
        setPost(data.post);
      } catch (e: any) {
        setError(e.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    if (id) run();
  }, [id, token]);

  if (loading) return <p className="p-4">Loading…</p>;
  if (error || !post) return <p className="p-4 text-red-600">{error || 'Not found'}</p>;

  return (
    <div className="max-w-xl mx-auto">
      <PostCard post={post} />
    </div>
  );
}

