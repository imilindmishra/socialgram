import { useCallback, useMemo, useState } from 'react';
import type { Post } from '../components/PostCard';
import { useAuth } from '../context/AuthContext';
import { toggleRetweet } from '../lib/api';

export function useRetweet(post: Post, setPost: (p: Post) => void) {
  const { token, user } = useAuth();
  const [busy, setBusy] = useState(false);
  const userId = user?.id;
  const retweeted = useMemo(() => !!userId && Array.isArray((post as any).retweets) && (post as any).retweets.some((u: any) => String(u) === String(userId)), [post, userId]);

  const toggle = useCallback(async () => {
    if (!userId || busy) return;
    setBusy(true);
    try {
      const res = await toggleRetweet(token || undefined, post._id);
      if (res.ok) {
        const data = await res.json();
        setPost(data.post);
      }
    } finally {
      setBusy(false);
    }
  }, [busy, token, post._id, setPost, userId]);

  return { retweeted, toggle, busy };
}

