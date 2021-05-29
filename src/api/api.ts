import { BASE_URL, STATIC_USER_DATA } from '../constants';
import type { TComment, TPost, TUser } from '../types';

export async function fakeLogin(): Promise<TUser> {
  return fetch(`${BASE_URL}/user/login`, {
    method: 'post',
    body: JSON.stringify(STATIC_USER_DATA),
    headers: { 'Content-Type': 'application/json' },
  }).then(res => res.json());
}

export type TFetchPostsParams = {
  offset: number;
  limit: number;
  refresh?: boolean;
};
export type TPostsResponse = {
  posts: TPost[];
  canFetchMorePosts: boolean;
};
export async function fetchPosts(
  params: TFetchPostsParams,
): Promise<TPostsResponse> {
  const searchParams = new URLSearchParams(
    Object.entries(params).reduce(
      (acc, [key, value]) => ({ ...acc, [key]: `${value}` }),
      {},
    ),
  );

  return fetch(`${BASE_URL}/posts?${searchParams}`).then(res => res.json());
}

export type TFetchCommentsParams = {
  offset: number;
  limit: number;
  refresh?: boolean;
};
export type TCommentsResponse = {
  comments: TComment[];
  canFetchMoreComments: boolean;
};
export async function fetchComments(
  postId: string,
  params: TFetchCommentsParams,
): Promise<TCommentsResponse> {
  const searchParams = new URLSearchParams(
    Object.entries(params).reduce(
      (acc, [key, value]) => ({ ...acc, [key]: `${value}` }),
      {},
    ),
  );

  return fetch(`${BASE_URL}/comments/${postId}?${searchParams}`).then(res =>
    res.json(),
  );
}
