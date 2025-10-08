import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function OnboardingUsername() {
  const { token, refreshMe } = useAuth();
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { document.title = 'Choose a username • SocialGram'; }, []);

  const api = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${api}/api/users/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ username }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to set username');
      await refreshMe();
      navigate('/feed', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="max-w-md mx-auto flex flex-col gap-3">
      <h1 className="text-xl font-semibold">Pick a username</h1>
      <p className="text-sm text-gray-600">Letters, numbers, dots, underscores. 3–20 characters.</p>
      <input
        className="border rounded px-3 py-2"
        placeholder="yourname"
        value={username}
        onChange={(e) => setUsername(e.target.value.toLowerCase())}
        minLength={3}
        maxLength={20}
        required
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button disabled={submitting} className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">
        {submitting ? 'Saving…' : 'Save'}
      </button>
    </form>
  );
}

