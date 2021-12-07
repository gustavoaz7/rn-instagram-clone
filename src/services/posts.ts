import { BASE_URL } from '../constants';
import type { TPost } from '../types';
import { makeFail, makeSuccess, RemoteData } from '../utils/remote-data';

export type TFetchPostsParams = {
  offset: number;
  limit: number;
  refresh?: boolean;
};
export type TPostsResponse = {
  posts: TPost[];
  canFetchMorePosts: boolean;
};
export type TRemotePosts = RemoteData<TPostsResponse, Error>;
export async function fetchPosts(
  params: TFetchPostsParams,
): Promise<TRemotePosts> {
  const searchParams = new URLSearchParams(
    Object.entries(params).reduce(
      (acc, [key, value]) => ({ ...acc, [key]: `${value}` }),
      {},
    ),
  );

  try {
    const posts = await fetch(`${BASE_URL}/posts?${searchParams}`).then(res =>
      res.json(),
    );
    return makeSuccess(posts);
  } catch (e) {
    return makeFail(e);
  }
}

export type TFetchUserPostsParams = Omit<TFetchPostsParams, 'refresh'>;
export type TUserPostsResponse = TPostsResponse;
export type TRemoteUserPosts = RemoteData<TUserPostsResponse, Error>;
export async function fetchUserPosts(
  username: string,
  params: TFetchPostsParams,
): Promise<TRemoteUserPosts> {
  const searchParams = new URLSearchParams(
    Object.entries(params).reduce(
      (acc, [key, value]) => ({ ...acc, [key]: `${value}` }),
      {},
    ),
  );

  try {
    const posts = await fetch(
      `${BASE_URL}/posts/${username}?${searchParams}`,
    ).then(res => res.json());
    return makeSuccess(posts);
  } catch (e) {
    return makeFail(e);
  }
}
