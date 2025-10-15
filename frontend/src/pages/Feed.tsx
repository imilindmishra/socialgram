import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { usePosts } from '../hooks/usePosts';
import { useTimeline } from '../hooks/useTimeline';
import { USE_TWEETS } from '../constants/env';

export default function Feed() {
  useDocumentTitle('Feed • SocialGram');
  const { user } = useAuth();
  const { posts, loading: loadingPosts } = usePosts();
  const { items, loading: loadingTimeline, loadMore, hasMore } = useTimeline(20);
  const useTl = USE_TWEETS;
  const loading = useTl ? loadingTimeline : loadingPosts;
  const list = useTl ? items : posts;

  return (
    <div className="flex flex-col gap-4 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold">Hello, {user?.name || 'there'}!</h2>
      {list.length === 0 ? (
        <p className="text-gray-600">No posts yet. Be the first to create one!</p>
      ) : (
        <>
          {list.map((p) => <PostCard key={p._id} post={p} />)}
          {useTl && hasMore && (
            <button onClick={loadMore} className="text-sm text-blue-600 self-center">Load more</button>
          )}
        </>
      )}
    </div>
  );
}
