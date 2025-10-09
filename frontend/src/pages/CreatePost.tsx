import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useCreatePost } from '../hooks/useCreatePost';

export default function CreatePost() {
  useDocumentTitle('Create Post • SocialGram');
  const { caption, setCaption, preview, submitting, error, onFileChange, submit } = useCreatePost();

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
