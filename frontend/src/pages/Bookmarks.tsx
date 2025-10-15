import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { listBookmarks } from '../lib/api';
import PostCard from '../components/PostCard';
import type { Post } from '../components/PostCard';

export default function Bookmarks() {
  const { token } = useAuth();
  const [items, setItems] = useState<Post[]>([]);
  const [cursor, setCursor] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);

  const load = async (cur?: string) => {
    setLoading(true);
    const res = await listBookmarks(token || undefined, { cursor: cur, limit: 20 });
    const data = await res.json();
    setItems((prev) => (cur ? [...prev, ...(data.posts || [])] : (data.posts || [])));
    setCursor(data.nextCursor);
    setHasMore(Boolean(data.nextCursor));
    setLoading(false);
  };

  useEffect(() => { load(undefined); }, []);

  return (
    <div className="flex flex-col gap-4 max-w-xl mx-auto">
      <h1 className="text-xl font-semibold">Bookmarks</h1>
      {loading && !items.length ? (
        <p className="text-gray-600">Loading…</p>
      ) : items.length ? (
        <>
          {items.map((p) => <PostCard key={p._id} post={p} />)}
          {hasMore && (
            <button className="self-center text-sm text-blue-600" onClick={() => load(cursor)}>Load more</button>
          )}
        </>
      ) : (
        <p className="text-gray-600">No bookmarks yet.</p>
      )}
    </div>
  );
}

