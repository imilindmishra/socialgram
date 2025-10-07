import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Feed from './pages/Feed';
import AuthCallback from './pages/AuthCallback';
import CreatePost from './pages/CreatePost';
import OnboardingUsername from './pages/OnboardingUsername';
import PublicProfile from './pages/PublicProfile';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, needsUsername } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  const path = window.location.pathname;
  if (needsUsername && path !== '/onboarding/username') {
    return <Navigate to="/onboarding/username" replace />;
  }
  return children;
}

function Navbar() {
  const { isAuthenticated, logout, user, needsUsername } = useAuth();
  return (
    <nav className="w-full flex items-center justify-between p-4 bg-white border-b">
      <Link to="/" className="font-semibold">SocialGram</Link>
      {isAuthenticated && (
        <div className="flex items-center gap-4">
          <Link to="/create" className="text-sm text-blue-600">Create Post</Link>
          {needsUsername ? (
            <Link to="/onboarding/username" className="text-sm">Set username</Link>
          ) : (
            <Link to={`/u/${user?.username}`} className="text-sm">Profile</Link>
          )}
          <button onClick={logout} className="text-sm text-red-600">Logout</button>
        </div>
      )}
    </nav>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <main className="max-w-xl mx-auto p-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/feed" element={<PrivateRoute><Feed /></PrivateRoute>} />
          <Route path="/create" element={<PrivateRoute><CreatePost /></PrivateRoute>} />
          <Route path="/onboarding/username" element={<PrivateRoute><OnboardingUsername /></PrivateRoute>} />
          <Route path="/u/:username" element={<PublicProfile />} />
          <Route path="/" element={<Navigate to="/feed" replace />} />
          <Route path="*" element={<Navigate to="/feed" replace />} />
        </Routes>
      </main>
    </AuthProvider>
  );
}
