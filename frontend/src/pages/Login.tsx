import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function Login() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    document.title = 'Login • SocialGram';
  }, []);

  if (isAuthenticated) return <Navigate to="/feed" replace />;

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
      <h1 className="text-2xl font-semibold">Welcome to SocialGram</h1>
      <button
        onClick={() => {
          window.location.href = `${apiUrl}/api/auth/google`;
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Continue with Google
      </button>
    </div>
  );
}

