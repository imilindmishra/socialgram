import { useState } from 'react';
import { updateMe } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export function useUsername() {
  const { token } = useAuth();
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (): Promise<void> => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await updateMe(token || undefined, { username });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to set username');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  return { username, setUsername, error, submitting, submit };
}
