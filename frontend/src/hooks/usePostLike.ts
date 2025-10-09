import { useAuth } from '../context/AuthContext';
import { API_URL } from '../constants/env';
import type { Post } from '../components/PostCard';

export function usePostLike(post: Post, setPost: (p: Post) => void) {
  const { token, user } = useAuth();
  const me = user?.id;
  const liked = !!post.likes?.some((id) => id === me);

  const toggleLike = async () => {
    // optimistic update
    setPost({
      ...post,
      likes: liked ? post.likes.filter((id) => id !== me) : [...(post.likes || []), me!],
    });
    try {
      const res = await fetch(`${API_URL}/api/posts/${post._id}/like`, {
        method: 'POST',
        headers: { Authorization: token ? `Bearer ${token}` : '' },
      });
      if (res.ok) {
        const data = await res.json();
        setPost(data.post);
      }
    } catch {
      // ignore; follow-up fetch will correct state
    }
  };

  return { liked, toggleLike };
}

