import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function CreatePost() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Create Post • SocialGram';
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const uploadToCloudinary = async (): Promise<string> => {
    if (!file) throw new Error('Please select an image');
    if (file.size > 5 * 1024 * 1024) throw new Error('Image too large (max 5MB)');

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) throw new Error('Cloudinary env vars missing');

    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', uploadPreset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: form,
    });
    if (!res.ok) throw new Error('Failed to upload image');
    const data = await res.json();
    return data.secure_url as string;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const imageUrl = await uploadToCloudinary();
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ caption, imageUrl }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to create post');
      }
      navigate('/feed', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <form onSubmit={onSubmit} className="max-w-xl mx-auto flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Create Post</h1>
      <textarea
        className="border rounded p-2"
        placeholder="Write a caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        maxLength={280}
        required
      />
      <input type="file" accept="image/*" onChange={onFileChange} required />
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

