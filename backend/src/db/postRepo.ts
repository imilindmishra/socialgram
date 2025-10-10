import { Post, IPost } from '../models/Post';
import type { IPostRepo } from '../interfaces/postRepo';

export async function listPostsPopulated() {
  return Post.find()
    .sort({ createdAt: -1 })
    .populate('author', 'name profilePicture')
    .populate('comments.user', 'name profilePicture')
    .populate('comments.replies.user', 'name profilePicture');
}

export async function createPost(doc: Pick<IPost, 'author' | 'caption' | 'imageUrl'>) {
  const post = await Post.create(doc as any);
  return post
    .populate('author', 'name profilePicture')
    .then((p) => p.populate('comments.user', 'name profilePicture'))
    .then((p) => p.populate('comments.replies.user', 'name profilePicture'));
}

export async function findPostById(id: string) {
  return Post.findById(id);
}

export async function populatePost(post: IPost) {
  return post
    .populate('author', 'name profilePicture')
    .then((p) => p.populate('comments.user', 'name profilePicture'))
    .then((p) => p.populate('comments.replies.user', 'name profilePicture'));
}

export async function savePost(post: IPost) {
  await post.save();
  return populatePost(post);
}

export const postRepo: IPostRepo = {
  list: () => listPostsPopulated(),
  create: (doc) => createPost(doc),
  findById: (id) => findPostById(id),
  save: (post) => savePost(post),
};
