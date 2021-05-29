import { database } from './database';
import { session } from './session';
import type { TComment, TPost } from '../src/types';
import type { TCommentDB, TPostDB, TLikeDB } from './types';

const getLikesFromFollowings = (likes: TLikeDB[]): TLikeDB[] => {
  const activeUsername = session.getUsername();
  const userFollowings = database.users.get(activeUsername)!.following;
  const likesFromFollowings = likes.filter(like =>
    userFollowings.includes(like.owner.username),
  );

  return likesFromFollowings;
};

export const tranformComment = (commentDb: TCommentDB): TComment => {
  const { associatedId, likesIds, ...comment } = commentDb;

  const likes = likesIds.map(likeId => database.likes.get(likeId)!);

  return {
    ...comment,
    previewLikes: {
      count: likes.length,
      likes: getLikesFromFollowings(likes).slice(0, 2),
    },
  };
};

export const transformPost = (postDb: TPostDB): TPost => {
  const { commentsIds, likesIds, ...post } = postDb;

  const comments = commentsIds.map(
    commentId => database.comments.get(commentId)!,
  );
  const likes = likesIds.map(likeId => database.likes.get(likeId)!);

  return {
    ...post,
    previewComments: {
      count: comments.length,
      comments: comments.slice(0, 2).map(tranformComment),
    },
    previewLikes: {
      count: likes.length,
      likes: getLikesFromFollowings(likes).slice(0, 2),
    },
  };
};
