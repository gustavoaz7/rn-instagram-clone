import type { TCommentDB, TLikeDB, TPostDB, TUserDB } from './types';

export type TDatabase = {
  users: Map<string, TUserDB>;
  posts: Map<string, TPostDB>;
  comments: Map<string, TCommentDB>;
  likes: Map<string, TLikeDB>;
};

export const database: TDatabase = {
  users: new Map(),
  posts: new Map(),
  comments: new Map(),
  likes: new Map(),
};
