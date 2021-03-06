import { Router } from 'express';
import { faker } from '@faker-js/faker';
import type {
  TFetchPostsParams,
  TPostsResponse,
  TFetchUserPostsParams,
  TUserPostsResponse,
} from '../../src/services/posts';
import { database } from '../database';
import { session } from '../session';
import { transformPost } from '../transformations';
import { generatePost, sortByCreatedAt } from '../utils';

export const postsRouter = Router();

type TGetPostsRes = TPostsResponse;
type TGetPostsQuery = TFetchPostsParams & { refresh?: string };
postsRouter.get<null, TGetPostsRes, null, TGetPostsQuery>('/', (req, res) => {
  const offset = Number(req.query.offset);
  const limit = Number(req.query.limit);
  const refresh =
    req.query.refresh !== undefined && req.query.refresh !== 'false';

  const currentUser = database.users.get(session.getUsername())!;

  if (refresh) {
    const user = database.users.get(
      faker.random.arrayElement(currentUser.following),
    )!;
    const post = generatePost(user, { createdAt: Date.now() });
    user.postsIds.push(post.id);
    database.posts.set(post.id, post);
  }

  const postsIds = currentUser.following
    .reduce<string[]>(
      (acc, username) => [...acc, ...database.users.get(username)!.postsIds],
      [],
    )
    .concat(currentUser.postsIds);

  const postsDBWithNext = postsIds
    .map(postId => database.posts.get(postId)!)
    .sort(sortByCreatedAt)
    .slice(offset, offset + limit + 1)
    .map(post => ({
      ...post,
      viewerHasLiked: post.likesIds.some(
        likeId =>
          database.likes.get(likeId)!.owner.username === currentUser.username,
      ),
    }));
  const canFetchMorePosts = postsDBWithNext.length > limit;

  const posts = postsDBWithNext.slice(0, -1).map(transformPost);

  return res.send({ posts, canFetchMorePosts });
});

type TGetUserPostsRes = TUserPostsResponse;
type TGetUserPostsQuery = TFetchUserPostsParams;
postsRouter.get<
  { username: string },
  TGetUserPostsRes,
  null,
  TGetUserPostsQuery
>('/:username', (req, res) => {
  const offset = Number(req.query.offset);
  const limit = Number(req.query.limit);
  const { username } = req.params;

  const currentUser = database.users.get(session.getUsername())!;
  const user = database.users.get(username)!;

  const postsDBWithNext = user.postsIds
    .map(postId => database.posts.get(postId)!)
    .sort(sortByCreatedAt)
    .slice(offset, offset + limit + 1)
    .map(post => ({
      ...post,
      viewerHasLiked: post.likesIds.some(
        likeId =>
          database.likes.get(likeId)!.owner.username === currentUser.username,
      ),
    }));
  const canFetchMorePosts = postsDBWithNext.length > limit;

  const posts = postsDBWithNext.slice(0, -1).map(transformPost);

  return res.send({ posts, canFetchMorePosts });
});
