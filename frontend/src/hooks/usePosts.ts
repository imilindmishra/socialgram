import { useEffect, useState, useCallback } from 'react';
import { listPosts } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import type { Post } from '../components/PostCard';

export function usePosts() {
  const { token } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listPosts(token || undefined);
      if (!res.ok) throw new Error('Failed to load posts');
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  return { posts, setPosts, loading, error, reload: load };
}
