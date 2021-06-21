import { Router } from 'express';
import type {
  TFetchCommentsParams,
  TCommentsResponse,
} from '../../src/services/comments';
import { database } from '../database';
import { session } from '../session';
import { tranformComment } from '../transformations';
import { generateComment, sortByCreatedAt } from '../utils';

export const commentsRouter = Router();

type TCommentsGetParams = { id: string };
type TCommentsGetRes = TCommentsResponse;
type TCommentsGetQuery = TFetchCommentsParams & { refresh?: string };
commentsRouter.get<
  TCommentsGetParams,
  TCommentsGetRes,
  null,
  TCommentsGetQuery
>('/:id', (req, res) => {
  const postId = req.params.id;
  const offset = Number(req.query.offset);
  const limit = Number(req.query.limit);
  const refresh = Boolean(req.query.refresh);

  const currentUser = database.users.get(session.getUsername())!;
  const post = database.posts.get(postId)!;

  if (refresh) {
    const comment = generateComment({
      associatedId: post.id,
      createdAt: Date.now(),
    });
    post.commentsIds.push(comment.id);
    database.comments.set(comment.id, comment);
  }

  const commentsDBWithNext = post.commentsIds
    .map(commentId => database.comments.get(commentId)!)
    .sort(sortByCreatedAt)
    .slice(offset, offset + limit + 1)
    .map(comment => ({
      ...comment,
      viewerHasLiked: comment.likesIds.some(
        likeId =>
          database.likes.get(likeId)!.owner.username === currentUser.username,
      ),
    }));
  const canFetchMoreComments = commentsDBWithNext.length > limit;
  const comments = commentsDBWithNext.slice(0, -1).map(tranformComment);

  return res.send({ comments, canFetchMoreComments });
});
