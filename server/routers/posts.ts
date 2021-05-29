import { Router } from 'express';
import type { TFetchPostsParams, TPostsResponse } from '../../src/api';
import { database } from '../database';
import { session } from '../session';
import { transformPost } from '../transformations';

export const postsRouter = Router();

type TGetPostsRes = TPostsResponse;
type TGetPostsQuery = TFetchPostsParams;
postsRouter.get<null, TGetPostsRes, null, TGetPostsQuery>('/', (req, res) => {
  const offset = Number(req.query.offset);
  const limit = Number(req.query.limit);

  const currentUser = database.users.get(session.getUsername())!;
  const postsIds = currentUser.following.reduce<string[]>(
    (acc, username) => [...acc, ...database.users.get(username)!.postsIds],
    [],
  );

  const postsDBWithNext = postsIds
    .map(postId => database.posts.get(postId)!)
    .slice(offset, offset + limit + 1);
  const canFetchMorePosts = postsDBWithNext.length > limit;

  const posts = postsDBWithNext.slice(0, -1).map(transformPost);

  return res.send({ posts, canFetchMorePosts });
});
