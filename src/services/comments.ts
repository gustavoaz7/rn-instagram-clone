import { BASE_URL } from '../constants';
import type { TComment } from '../types';

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
