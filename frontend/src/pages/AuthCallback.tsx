import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function useQuery() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

export default function AuthCallback() {
  const query = useQuery();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const token = query.get('token');
    if (token) {
      loginWithToken(token);
      navigate('/feed', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, []);

  return <p>Signing you in…</p>;
}

