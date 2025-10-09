import { createPostService } from '../../src/services/postService';
import type { IPostRepo } from '../../src/interfaces/postRepo';

function makeRepo(initial: any[] = []) {
  const store = [...initial];
  return {
    list: async () => store as any,
    create: async (doc: any) => {
      const post = {
        _id: `${Date.now()}`,
        likes: [],
        comments: [],
        createdAt: new Date(),
        ...doc,
      };
      store.unshift(post);
      return post as any;
    },
    findById: async (id: string) => (store.find((p) => p._id === id) || null) as any,
    save: async (post: any) => post as any,
  } as IPostRepo;
}

describe('postService', () => {
  test('createPost validates caption and imageUrl', async () => {
    const svc = createPostService(makeRepo());
    await expect(svc.createPost('u1', '', 'http://img')).rejects.toThrow('Caption is required');
    await expect(svc.createPost('u1', 'ok', 'not-a-url')).rejects.toThrow('Valid imageUrl required');
  });

  test('createPost success returns post', async () => {
    const svc = createPostService(makeRepo());
    const post = await svc.createPost('u1', 'hello', 'https://example.com/img.jpg');
    expect(post.caption).toBe('hello');
    expect(post.imageUrl).toContain('https://');
  });

  test('toggleLike toggles like state', async () => {
    const repo = makeRepo([
      { _id: 'p1', author: 'u1', caption: 'c', imageUrl: 'https://x', likes: [], comments: [], createdAt: new Date() },
    ]);
    const svc = createPostService(repo);
    const liked = await svc.toggleLike('p1', 'u2');
    expect(liked.likes).toContain('u2');
    const unliked = await svc.toggleLike('p1', 'u2');
    expect(unliked.likes).not.toContain('u2');
  });

  test('addComment validates text and appends', async () => {
    const repo = makeRepo([
      { _id: 'p1', author: 'u1', caption: 'c', imageUrl: 'https://x', likes: [], comments: [], createdAt: new Date() },
    ]);
    const svc = createPostService(repo);
    await expect(svc.addComment('p1', 'u2', '   ')).rejects.toThrow('Comment text is required');
    const updated = await svc.addComment('p1', 'u2', 'Nice!');
    expect(updated.comments.at(-1)?.text).toBe('Nice!');
  });
});

