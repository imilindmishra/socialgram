import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Feed() {
  const { user } = useAuth();

  useEffect(() => {
    document.title = 'Feed • SocialGram';
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Hello, {user?.name || 'there'}!</h2>
      <p className="text-gray-600">Phase 1: You are logged in. Feed coming in Phase 2.</p>
    </div>
  );
}

