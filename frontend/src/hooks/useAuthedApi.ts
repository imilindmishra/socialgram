import { API_URL } from '../constants/env';
import { useAuth } from '../context/AuthContext';

export function useAuthedApi() {
  const { token } = useAuth();
  const base = API_URL;

  const mergeHeaders = (extra?: HeadersInit) => {
    const h: Record<string, string> = {};
    if (token) h.Authorization = `Bearer ${token}`;
    // Merge after adding auth, so explicit caller headers can override
    return { ...h, ...(extra as any) } as HeadersInit;
  };

  return {
    get: (path: string, init?: RequestInit) =>
      fetch(`${base}${path}`, { ...(init || {}), method: 'GET', headers: mergeHeaders(init?.headers) }),
    post: (path: string, body?: unknown, init?: RequestInit) =>
      fetch(`${base}${path}`, {
        ...(init || {}),
        method: 'POST',
        headers: mergeHeaders({ 'Content-Type': 'application/json', ...(init?.headers as any) }),
        body: body != null ? JSON.stringify(body) : undefined,
      }),
    patch: (path: string, body?: unknown, init?: RequestInit) =>
      fetch(`${base}${path}`, {
        ...(init || {}),
        method: 'PATCH',
        headers: mergeHeaders({ 'Content-Type': 'application/json', ...(init?.headers as any) }),
        body: body != null ? JSON.stringify(body) : undefined,
      }),
  };
}

