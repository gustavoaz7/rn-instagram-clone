import type { TUser, TComment, TPost, TLike, TStoryMedia } from '../src/types';

export type {
  TComment,
  TPostMedia,
  TTappableObject,
  TOwner,
  TStory,
} from '../src/types';

export type TUserDB = TUser & {
  postsIds: string[];
  storiesIds: string[];
};

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

export type TStoryMediaDB = TStoryMedia & {
  viewersIds: string[];
};
