import { BASE_URL } from '../constants';
import type { TComment } from '../types';
import { makeFail, makeSuccess, RemoteData } from '../utils/remote-data';

export type TFetchCommentsParams = {
  offset: number;
  limit: number;
  refresh?: boolean;
};
export type TCommentsResponse = {
  comments: TComment[];
  canFetchMoreComments: boolean;
};
export type TRemoteComments = RemoteData<TCommentsResponse, Error>;
export async function fetchComments(
  postId: string,
  params: TFetchCommentsParams,
): Promise<TRemoteComments> {
  const searchParams = new URLSearchParams(
    Object.entries(params).reduce(
      (acc, [key, value]) => ({ ...acc, [key]: `${value}` }),
      {},
    ),
  );

  try {
    const comments = await fetch(
      `${BASE_URL}/comments/${postId}?${searchParams}`,
    ).then(res => res.json());

    return makeSuccess(comments);
  } catch (e) {
    return makeFail(e);
  }
}
