import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useUsername } from '../hooks/useUsername';

export default function OnboardingUsername() {
  const { refreshMe } = useAuth();
  const navigate = useNavigate();
  useDocumentTitle('Choose a username • SocialGram');
  const { username, setUsername, error, submitting, submit } = useUsername();

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          await submit();
          await refreshMe();
          navigate('/feed', { replace: true });
        } catch {}
      }}
      className="max-w-md mx-auto flex flex-col gap-3"
    >
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
