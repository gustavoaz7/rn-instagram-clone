import { Router } from 'express';
import type { TFetchCommentsParams, TCommentsResponse } from '../../src/api';
import { database } from '../database';
import { tranformComment } from '../transformations';

export const commentsRouter = Router();

type TCommentsGetParams = { id: string };
type TCommentsGetRes = TCommentsResponse;
type TCommentsGetQuery = TFetchCommentsParams;
commentsRouter.get<
  TCommentsGetParams,
  TCommentsGetRes,
  null,
  TCommentsGetQuery
>('/:id', (req, res) => {
  const postId = req.params.id;
  const offset = Number(req.query.offset);
  const limit = Number(req.query.limit);

  const post = database.posts.get(postId)!;
  const commentsDBWithNext = post.commentsIds
    .map(commentId => database.comments.get(commentId)!)
    .slice(offset, offset + limit + 1);
  const canFetchMoreComments = commentsDBWithNext.length > limit;
  const comments = commentsDBWithNext.slice(0, -1).map(tranformComment);

  return res.send({ comments, canFetchMoreComments });
});
