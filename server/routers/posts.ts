import { Router } from 'express';
import type { TFetchPostsParams, TPostsResponse } from '../../src/api';
import { database } from '../database';
import { transformPost } from '../transformations';

export const postsRouter = Router();

type TGetPostsRes = TPostsResponse;
type TGetPostsQuery = TFetchPostsParams;
postsRouter.get<null, TGetPostsRes, null, TGetPostsQuery>('/', (req, res) => {
  const offset = Number(req.query.offset);
  const limit = Number(req.query.limit);

  const postsDBWithNext = database.posts.slice(offset, offset + limit + 1);
  const canFetchMorePosts = postsDBWithNext.length > limit;

  const posts = postsDBWithNext.slice(0, -1).map(transformPost);

  return res.send({ posts, canFetchMorePosts });
});
