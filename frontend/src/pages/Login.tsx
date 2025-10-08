import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { API_URL } from '../constants/env';

export default function Login() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    document.title = 'Login • SocialGram';
  }, []);

  if (isAuthenticated) return <Navigate to="/feed" replace />;

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
      <h1 className="text-2xl font-semibold">Welcome to SocialGram</h1>
      <button
        onClick={() => {
          window.location.href = `${API_URL}/api/auth/google`;
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Continue with Google
      </button>
    </div>
  );
}
