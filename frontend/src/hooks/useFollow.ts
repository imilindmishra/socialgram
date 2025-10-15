import { useCallback, useEffect, useState } from 'react';
import { followUser, unfollowUser, listFollowers } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export function useFollow(username: string) {
  const { token, user } = useAuth();
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const me = user?.username;

  const check = useCallback(async () => {
    if (!username || !me) return;
    try {
      const res = await listFollowers(username);
      if (!res.ok) return;
      const data = await res.json();
      setFollowing(Boolean((data.users || []).find((u: any) => u.username === me)));
    } catch {}
  }, [username, me]);

  useEffect(() => { check(); }, [check]);

  const toggle = useCallback(async () => {
    if (!username) return;
    setLoading(true);
    try {
      if (following) {
        const res = await unfollowUser(token || undefined, username);
        if (res.ok) setFollowing(false);
      } else {
        const res = await followUser(token || undefined, username);
        if (res.ok) setFollowing(true);
      }
    } finally {
      setLoading(false);
    }
  }, [username, following, token]);

  return { following, loading, toggle };
}

