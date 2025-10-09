import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthedApi } from './useAuthedApi';
import { useCloudinaryUpload } from './useCloudinaryUpload';

export function useCreatePost() {
  const api = useAuthedApi();
  const upload = useCloudinaryUpload();
  const navigate = useNavigate();

  const [caption, setCaption] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFileChange = (f: File | null) => {
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const imageUrl = await upload(file!);
      const res = await api.post('/api/posts', { caption, imageUrl });
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

  return { caption, setCaption, file, preview, submitting, error, onFileChange, submit };
}

