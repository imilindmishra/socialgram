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

// Tweet API (Phase 1: mirrors post endpoints)
export async function listTweets(token?: string) {
  const res = await fetch(`${API_URL}/api/tweets`, { headers: authHeaders(token) });
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

export async function createTweet(
  token: string | undefined,
  body: { text: string; media?: string[] }
) {
  const res = await fetch(`${API_URL}/api/tweets`, {
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

export async function toggleTweetLike(token: string | undefined, tweetId: string) {
  const res = await fetch(`${API_URL}/api/tweets/${tweetId}/like`, {
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

export async function addTweetComment(token: string | undefined, tweetId: string, text: string) {
  const res = await fetch(`${API_URL}/api/tweets/${tweetId}/comments`, {
    method: 'POST',
    headers: authHeaders(token, { 'Content-Type': 'application/json' }),
    body: JSON.stringify({ text }),
  });
  return res;
}

export async function addReply(
  token: string | undefined,
  postId: string,
  commentId: string,
  text: string
) {
  const res = await fetch(`${API_URL}/api/posts/${postId}/comments/${commentId}/replies`, {
    method: 'POST',
    headers: authHeaders(token, { 'Content-Type': 'application/json' }),
    body: JSON.stringify({ text }),
  });
  return res;
}

export async function addTweetReply(
  token: string | undefined,
  tweetId: string,
  commentId: string,
  text: string
) {
  const res = await fetch(`${API_URL}/api/tweets/${tweetId}/comments/${commentId}/replies`, {
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

export async function searchUsers(query: string) {
  const q = query.trim();
  if (!q) return { ok: true, json: async () => ({ users: [] }) } as any;
  const res = await fetch(`${API_URL}/api/users/search?q=${encodeURIComponent(q)}`);
  return res;
}
