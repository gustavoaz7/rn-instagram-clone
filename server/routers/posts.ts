import { Router } from 'express';
import { database } from '../database';

export const postsRouter = Router();

postsRouter.get('/', (req, res) => {
  const posts = database.posts.slice(0, 20);
  return res.send(posts);
});
