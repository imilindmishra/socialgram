import { API_URL } from '../constants/env';

type HeadersLike = HeadersInit | undefined;

function authHeaders(token?: string, extra?: HeadersLike): HeadersInit {
  const base: Record<string, string> = {};
  if (token) base.Authorization = `Bearer ${token}`;
  return { ...base, ...(extra as any) } as HeadersInit;
}

export async function getMe(token?: string) {
  const res = await fetch(`${API_URL}/api/auth/me`, { headers: authHeaders(token) });
  return res;
}

export async function listPosts(token?: string) {
  const res = await fetch(`${API_URL}/api/posts`, { headers: authHeaders(token) });
  return res;
}

export async function createPost(token: string | undefined, body: { caption: string; imageUrl: string }) {
  const res = await fetch(`${API_URL}/api/posts`, {
    method: 'POST',
    headers: authHeaders(token, { 'Content-Type': 'application/json' }),
    body: JSON.stringify(body),
  });
  return res;
}

export async function toggleLike(token: string | undefined, postId: string) {
  const res = await fetch(`${API_URL}/api/posts/${postId}/like`, {
    method: 'POST',
    headers: authHeaders(token),
  });
  return res;
}

export async function addComment(token: string | undefined, postId: string, text: string) {
  const res = await fetch(`${API_URL}/api/posts/${postId}/comments`, {
    method: 'POST',
    headers: authHeaders(token, { 'Content-Type': 'application/json' }),
    body: JSON.stringify({ text }),
  });
  return res;
}

export async function updateMe(token: string | undefined, data: { username: string }) {
  const res = await fetch(`${API_URL}/api/users/me`, {
    method: 'PATCH',
    headers: authHeaders(token, { 'Content-Type': 'application/json' }),
    body: JSON.stringify(data),
  });
  return res;
}

export async function getPublicProfile(username: string) {
  const res = await fetch(`${API_URL}/api/users/${username}`);
  return res;
}

export async function listUserPosts(username: string) {
  const res = await fetch(`${API_URL}/api/users/${username}/posts`);
  return res;
}

