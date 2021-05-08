import type { TPost, TUser } from '../src/types';

export type TDatabase = {
  users: TUser[];
  posts: TPost[];
};

export const database: TDatabase = {
  users: [],
  posts: [],
};
