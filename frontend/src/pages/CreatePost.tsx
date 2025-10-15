import { useEffect, useState } from 'react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useCreatePost } from '../hooks/useCreatePost';
import { searchUsers } from '../lib/api';

export default function CreatePost() {
  useDocumentTitle('Create Post • SocialGram');
  const { caption, setCaption, preview, submitting, error, onFileChange, submit } = useCreatePost();
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionOpen, setMentionOpen] = useState(false);
  const [mentionResults, setMentionResults] = useState<Array<{ username?: string; name?: string }>>([]);
  const [mentionIndex, setMentionIndex] = useState(0);

  // Detect active mention fragment from caption (last "@word" without space)
  function detectMention(text: string) {
    const upto = text; // simpler: whole string
    const m = upto.match(/(^|\s)@([a-zA-Z0-9._]{1,20})$/);
    if (m) return m[2];
    return '';
  }

  // Debounced fetch of user suggestions
  useEffect(() => {
    const q = detectMention(caption);
    setMentionQuery(q);
    if (!q) {
      setMentionOpen(false);
      setMentionResults([]);
      return;
    }
    setMentionOpen(true);
    let cancelled = false;
    const t = setTimeout(async () => {
      try {
        const res = await searchUsers(q);
        const data = await res.json().catch(() => ({ users: [] }));
        if (!cancelled) {
          setMentionResults(data.users || []);
          setMentionIndex(0);
        }
      } catch {}
    }, 250);
    return () => { cancelled = true; clearTimeout(t); };
  }, [caption]);

  function insertMention(username: string) {
    const re = /(^|\s)@([a-zA-Z0-9._]{1,20})$/;
    const replaced = caption.replace(re, (all, pre) => `${pre}@${username}`);
    setCaption(replaced + ' ');
    setMentionOpen(false);
    setMentionResults([]);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="max-w-xl mx-auto flex flex-col gap-4"
    >
      <h1 className="text-xl font-semibold">Create Post</h1>
      <textarea
        className="border rounded p-2"
        placeholder="Write a caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        maxLength={280}
        required
      />
      {mentionOpen && mentionResults.length > 0 && (
        <div className="border rounded bg-white shadow max-w-sm">
          {mentionResults.slice(0, 8).map((u, i) => (
            <button
              key={`${u.username}-${i}`}
              type="button"
              onClick={() => u.username && insertMention(u.username)}
              className={`block w-full text-left px-3 py-1 text-sm ${i === mentionIndex ? 'bg-gray-50' : ''}`}
            >
              <span className="font-medium mr-2">{u.username ? `@${u.username}` : ''}</span>
              <span className="text-gray-600">{u.name}</span>
            </button>
          ))}
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => onFileChange(e.target.files?.[0] || null)}
        required
      />
      {preview && <img src={preview} alt="preview" className="rounded border" />}
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {submitting ? 'Posting…' : 'Post'}
      </button>
    </form>
  );
}
