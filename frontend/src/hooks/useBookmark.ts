import { useCallback, useState } from 'react';
import { toggleBookmark } from '../lib/api';
import type { Post } from '../components/PostCard';
import { useAuth } from '../context/AuthContext';

export function useBookmark(_post: Post) {
  const { token } = useAuth();
  const [bookmarked, setBookmarked] = useState(false);
  const [busy, setBusy] = useState(false);

  const toggle = useCallback(async (id: string) => {
    if (busy) return;
    setBusy(true);
    try {
      const res = await toggleBookmark(token || undefined, id);
      if (res.ok) {
        const data = await res.json();
        setBookmarked(Boolean(data.bookmarked));
      }
    } finally {
      setBusy(false);
    }
  }, [token, busy]);

  return { bookmarked, toggle, busy };
}

