import { useCallback, useEffect, useState } from 'react';
import { API_URL } from '../constants/env';

type PublicUser = { username: string; name: string; profilePicture?: string; createdAt: string };
import type { Post } from '../components/PostCard';

export function usePublicProfile(username: string) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [uRes, pRes] = await Promise.all([
        fetch(`${API_URL}/api/users/${username}`),
        fetch(`${API_URL}/api/users/${username}/posts`),
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
  }, [username]);

  useEffect(() => {
    if (username) load();
  }, [username, load]);

  return { user, posts, loading, error, reload: load };
}

