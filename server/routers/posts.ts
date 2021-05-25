import { Router } from 'express';
import { database } from '../database';

export const postsRouter = Router();

postsRouter.get('/', (req, res) => {
  const offset = Number(req.query.offset);
  const limit = Number(req.query.limit);

  const postsWithNext = database.posts.slice(offset, offset + limit + 1);

  const canFetchMorePosts = postsWithNext.length > limit;
  const posts = postsWithNext.slice(0, -1);
  return res.send({ posts, canFetchMorePosts });
});
