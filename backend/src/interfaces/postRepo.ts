import type { IPost } from '../models/Post';

export interface IPostRepo {
  list(): Promise<IPost[]>;
  create(
    doc: Pick<IPost, 'author' | 'caption'> & Partial<Pick<IPost, 'imageUrl' | 'mediaUrls'>>
  ): Promise<IPost>;
  findById(id: string): Promise<IPost | null>;
  save(post: IPost): Promise<IPost>;
}
