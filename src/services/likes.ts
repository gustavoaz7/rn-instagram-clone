import { BASE_URL } from '../constants';

export type TPostLikeBody = {
  collection: 'posts' | 'comments';
  id: string;
  flag: boolean;
};
export type TPostLikeResponse = void;
export async function postLike(
  body: TPostLikeBody,
): Promise<TPostLikeResponse> {
  fetch(`${BASE_URL}/likes`, {
    method: 'post',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}
