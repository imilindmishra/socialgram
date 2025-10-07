import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Feed from './pages/Feed';
import AuthCallback from './pages/AuthCallback';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  return (
    <nav className="w-full flex items-center justify-between p-4 bg-white border-b">
      <Link to="/" className="font-semibold">SocialGram</Link>
      {isAuthenticated && (
        <button onClick={logout} className="text-sm text-red-600">Logout</button>
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
          <Route path="/" element={<Navigate to="/feed" replace />} />
          <Route path="*" element={<Navigate to="/feed" replace />} />
        </Routes>
      </main>
    </AuthProvider>
  );
}

