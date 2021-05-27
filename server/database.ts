import type { TCommentDB, TLikeDB, TPostDB, TUser } from './types';

export type TDatabase = {
  users: TUser[];
  posts: TPostDB[];
  comments: TCommentDB[];
  likes: TLikeDB[];
};

export const database: TDatabase = {
  users: [],
  posts: [],
  comments: [],
  likes: [],
};
