import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Feed from './pages/Feed';
import AuthCallback from './pages/AuthCallback';
import CreatePost from './pages/CreatePost';
import OnboardingUsername from './pages/OnboardingUsername';
import PublicProfile from './pages/PublicProfile';
import Bookmarks from './pages/Bookmarks';
import TweetDetail from './pages/TweetDetail';
// Removed Hashtag, SearchTweets, and Notifications features

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, needsUsername } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  const path = window.location.pathname;
  if (needsUsername && path !== '/onboarding/username') {
    return <Navigate to="/onboarding/username" replace />;
  }
  return children;
}

import { useUserSearch } from './hooks/useUserSearch';

function Navbar() {
  const { isAuthenticated, logout, user, needsUsername } = useAuth();
  const navigate = useNavigate();
  const { query, setQuery, results, open, setOpen, loading, activeIndex, setActiveIndex, onKeyDown } = useUserSearch();
  return (
    <nav className="w-full flex items-center justify-between p-4 bg-white border-b">
      <Link to="/" className="font-semibold">SocialGram</Link>
      {isAuthenticated && (
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              className="border rounded px-3 py-1 text-sm w-56"
              placeholder="Search users…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onBlur={() => setTimeout(() => setOpen(false), 150)}
              onKeyDown={onKeyDown}
            />
            {open && (query.trim() || loading) && (
              <div className="absolute z-20 mt-1 w-full bg-white border rounded shadow">
                {loading ? (
                  <div className="px-3 py-2 text-sm text-gray-600">Searching…</div>
                ) : results.length ? (
                  results.map((u, i) => (
                    <button
                      key={`${u.username}-${i}`}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${i === activeIndex ? 'bg-gray-50' : ''}`}
                      onMouseEnter={() => setActiveIndex(i)}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        if (u.username) {
                          navigate(`/u/${u.username}`);
                          setOpen(false);
                          setQuery('');
                        }
                      }}
                    >
                      <span className="font-medium mr-2">{u.username ? `@${u.username}` : ''}</span>
                      <span className="text-gray-600">{u.name}</span>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-600">No results</div>
                )}
              </div>
            )}
          </div>
          <Link to="/create" className="text-sm text-blue-600">Create Post</Link>
          <Link to="/bookmarks" className="text-sm">Bookmarks</Link>
          {needsUsername ? (
            <Link to="/onboarding/username" className="text-sm">Set username</Link>
          ) : (
            <Link to={`/u/${user?.username}`} className="text-sm">Profile</Link>
          )}
          <button
            onClick={() => {
              logout();
              navigate('/login', { replace: true });
            }}
            className="text-sm text-red-600"
          >
            Logout
          </button>
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
          <Route path="/bookmarks" element={<PrivateRoute><Bookmarks /></PrivateRoute>} />
          <Route path="/t/:id" element={<PrivateRoute><TweetDetail /></PrivateRoute>} />
          <Route path="/u/:username" element={<PublicProfile />} />
          <Route path="/" element={<Navigate to="/feed" replace />} />
          <Route path="*" element={<Navigate to="/feed" replace />} />
        </Routes>
      </main>
    </AuthProvider>
  );
}
