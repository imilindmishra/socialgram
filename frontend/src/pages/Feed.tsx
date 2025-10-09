import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { usePosts } from '../hooks/usePosts';

export default function Feed() {
  useDocumentTitle('Feed • SocialGram');
  const { user } = useAuth();
  const { posts, loading } = usePosts();

  if (loading) return <p className="p-4">Loading…</p>;

  return (
    <div className="flex flex-col gap-4 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold">Hello, {user?.name || 'there'}!</h2>
      {posts.length === 0 ? (
        <p className="text-gray-600">No posts yet. Be the first to create one!</p>
      ) : (
        posts.map((p) => <PostCard key={p._id} post={p} />)
      )}
    </div>
  );
}
