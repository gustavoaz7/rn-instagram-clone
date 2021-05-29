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

function sortByDate<T extends { createdAt: number }>(entries: [string, T][]) {
  return entries.sort(
    ([, entryA], [, entryB]) => entryB.createdAt - entryA.createdAt,
  );
}

/* eslint-disable func-names */
database.posts[Symbol.iterator] = function* () {
  yield* sortByDate([...this.entries()]);
};
database.comments[Symbol.iterator] = function* () {
  yield* sortByDate([...this.entries()]);
};
database.likes[Symbol.iterator] = function* () {
  yield* sortByDate([...this.entries()]);
};
