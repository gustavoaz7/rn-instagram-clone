import type { TCommentDB, TPostDB, TUser } from './types';

export type TDatabase = {
  users: TUser[];
  posts: TPostDB[];
  comments: TCommentDB[];
};

export const database: TDatabase = {
  users: [],
  posts: [],
  comments: [],
};
