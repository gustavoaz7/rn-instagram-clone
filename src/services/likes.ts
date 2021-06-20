import { BASE_URL } from '../constants';

export type TSaveLikeBody = {
  collection: 'posts' | 'comments';
  id: string;
  flag: boolean;
};
export type TSaveLikeResponse = void;
export async function postLike(
  body: TSaveLikeBody,
): Promise<TSaveLikeResponse> {
  fetch(`${BASE_URL}/likes`, {
    method: 'post',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}
