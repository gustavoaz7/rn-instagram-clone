import { Router } from 'express';
import type { TPost } from '../../src/types';
import { database } from '../database';
import { transformPost } from '../transformations';

export const postsRouter = Router();

postsRouter.get<null, { posts: TPost[]; canFetchMorePosts: boolean }>(
  '/',
  (req, res) => {
    const offset = Number(req.query.offset);
    const limit = Number(req.query.limit);

    const postsDBWithNext = database.posts.slice(offset, offset + limit + 1);
    const canFetchMorePosts = postsDBWithNext.length > limit;

    const posts: TPost[] = postsDBWithNext.slice(0, -1).map(transformPost);

    return res.send({ posts, canFetchMorePosts });
  },
);
