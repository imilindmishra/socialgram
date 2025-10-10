import { useEffect, useMemo, useState } from 'react';
import { searchUsers } from '../lib/api';

export type UserSuggestion = { username?: string; name?: string; profilePicture?: string };

export function useUserSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!open) return;
    const q = query.trim();
    if (!q) {
      setResults([]);
      return;
    }
    let cancelled = false;
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchUsers(q);
        const data = await res.json().catch(() => ({ users: [] }));
        if (!cancelled) {
          setResults(data.users || []);
          setActiveIndex(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [query, open]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || !results.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    }
  };

  return {
    query,
    setQuery,
    results,
    open,
    setOpen,
    loading,
    activeIndex,
    setActiveIndex,
    onKeyDown,
  };
}

