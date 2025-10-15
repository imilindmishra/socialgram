import { useCallback, useEffect, useState } from 'react';
import { getHomeTimeline } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import type { Post } from '../components/PostCard';

export function useTimeline(limit = 20) {
  const { token } = useAuth();
  const [items, setItems] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);

  const load = useCallback(async (cursor?: string) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getHomeTimeline(token || undefined, { cursor, limit });
      if (!res.ok) throw new Error('Failed to load timeline');
      const data = await res.json();
      setItems((prev) => (cursor ? [...prev, ...(data.posts || [])] : (data.posts || [])));
      setNextCursor(data.nextCursor);
      setHasMore(Boolean(data.nextCursor));
    } catch (err: any) {
      setError(err.message || 'Failed to load timeline');
    } finally {
      setLoading(false);
    }
  }, [token, limit, loading]);

  useEffect(() => {
    load(undefined);
  }, [load]);

  const loadMore = useCallback(() => {
    if (hasMore && nextCursor) load(nextCursor);
  }, [hasMore, nextCursor, load]);

  return { items, loading, error, hasMore, loadMore, reload: () => load(undefined) };
}

