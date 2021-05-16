import { Router } from 'express';
import { database } from '../database';

export const postsRouter = Router();

postsRouter.get('/', (req, res) => {
  const offset = Number(req.query.offset);
  const limit = Number(req.query.limit);

  const posts = database.posts.slice(offset, offset + limit);
  const canFetchMorePosts = posts.length < limit;
  return res.send({ posts, canFetchMorePosts });
});
