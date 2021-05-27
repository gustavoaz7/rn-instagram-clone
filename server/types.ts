import type { TComment, TPost, TLike } from '../src/types';

export type {
  TUser,
  TComment,
  TPostMedia,
  TTappableObject,
  TOwner,
} from '../src/types';

export type TPostDB = Omit<TPost, 'previewComments' | 'previewLikes'> & {
  commentsIds: string[];
  likesIds: string[];
};

export type TCommentDB = Omit<TComment, 'previewLikes'> & {
  associatedId: string;
  likesIds: string[];
};

export type TLikeDB = TLike & {
  associatedId: string;
};
