import { useEffect, useState, useCallback } from 'react';
import { listTweets } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import type { Post as Tweet } from '../components/PostCard';


export function useTweets() {
  const { token } = useAuth();
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listTweets(token || undefined);
      if (!res.ok) throw new Error('Failed to load tweets');
      const data = await res.json();
      setTweets(data.posts || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load tweets');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  return { tweets, setTweets, loading, error, reload: load };
}

