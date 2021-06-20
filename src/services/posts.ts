import { BASE_URL } from '../constants';
import type { TPost } from '../types';

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
