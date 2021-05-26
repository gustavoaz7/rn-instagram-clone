import type { TComment, TPost } from '../src/types';

export type {
  TUser,
  TComment,
  TPostMedia,
  TTappableObject,
  TOwner,
} from '../src/types';

export type TPostDB = Omit<TPost, 'comments' | 'commentsCount'> & {
  commentsIds: string[];
};

export type TCommentDB = TComment & { associatedId: string };
