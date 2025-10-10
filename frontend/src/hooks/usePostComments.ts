import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { addComment as apiAddComment } from '../lib/api';
import type { Post } from '../components/PostCard';

export function usePostComments(post: Post, setPost: (p: Post) => void) {
  const { token } = useAuth();
  const [commentText, setCommentText] = useState('');

  const submitComment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const res = await apiAddComment(token || undefined, post._id, commentText.trim());
      if (res.ok) {
        const data = await res.json();
        setPost(data.post);
        setCommentText('');
      }
    } catch {
      // ignore for now
    }
  };

  return { commentText, setCommentText, submitComment };
}
