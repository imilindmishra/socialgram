import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadImageToCloudinary } from '../lib/cloudinary';
import { createPost } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export function useCreatePost() {
  const { token } = useAuth();
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
      const imageUrl = await uploadImageToCloudinary(file!);
      const res = await createPost(token || undefined, { caption, imageUrl });
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
