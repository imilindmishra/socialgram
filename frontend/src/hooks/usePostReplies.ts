import { useState } from 'react';
import type { Post } from '../components/PostCard';
import { addReply as apiAddReply } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export function usePostReplies(post: Post, setPost: (p: Post) => void) {
  const { token } = useAuth();
  const [openFor, setOpenFor] = useState<string | null>(null);
  const [texts, setTexts] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<Record<string, boolean>>({});

  const setText = (commentId: string, value: string) =>
    setTexts((m) => ({ ...m, [commentId]: value }));

  const submit = async (commentId: string) => {
    const value = (texts[commentId] || '').trim();
    if (!value) return;
    setSubmitting((m) => ({ ...m, [commentId]: true }));
    try {
      const res = await apiAddReply(token || undefined, post._id, commentId, value);
      if (res.ok) {
        const data = await res.json();
        setPost(data.post);
        setTexts((m) => ({ ...m, [commentId]: '' }));
        setOpenFor(null);
      }
    } finally {
      setSubmitting((m) => ({ ...m, [commentId]: false }));
    }
  };

  return { openFor, setOpenFor, texts, setText, submit, submitting };
}

