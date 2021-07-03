import { BASE_URL } from '../constants';
import { makeFail, makeSuccess, RemoteData } from '../utils/remote-data';

export type TPostLikeBody = {
  collection: 'posts' | 'comments';
  id: string;
  flag: boolean;
};
export type TPostLikeResponse = void;
export type TRemotePostLike = RemoteData<TPostLikeResponse, Error>;
export async function postLike(body: TPostLikeBody): Promise<TRemotePostLike> {
  try {
    await fetch(`${BASE_URL}/likes`, {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    });

    return makeSuccess(undefined);
  } catch (e) {
    return makeFail(e);
  }
}
