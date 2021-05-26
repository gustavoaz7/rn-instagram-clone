import { Router } from 'express';
import type { TPost } from '../../src/types';
import { database } from '../database';

export const postsRouter = Router();

const COMMENTS_LIMIT = 10;

postsRouter.get<null, { posts: TPost[]; canFetchMorePosts: boolean }>(
  '/',
  (req, res) => {
    const offset = Number(req.query.offset);
    const limit = Number(req.query.limit);

    const postsDBWithNext = database.posts.slice(offset, offset + limit + 1);
    const canFetchMorePosts = postsDBWithNext.length > limit;

    const posts = postsDBWithNext
      .slice(0, -1)
      .map(({ commentsIds, ...post }) => {
        const comments = database.comments.filter(
          comment => comment.associatedId === post.id,
        );
        const commentsCount = comments.length;

        return {
          ...post,
          comments: comments.slice(0, COMMENTS_LIMIT),
          commentsCount,
        };
      });
    return res.send({ posts, canFetchMorePosts });
  },
);
