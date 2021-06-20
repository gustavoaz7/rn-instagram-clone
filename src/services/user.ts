import { BASE_URL, STATIC_USER_DATA } from '../constants';
import type { TUser } from '../types';

export type TFakeLoginBody = typeof STATIC_USER_DATA;
export type TFakeLoginResponse = TUser;
export async function fakeLogin(): Promise<TFakeLoginResponse> {
  return fetch(`${BASE_URL}/user/login`, {
    method: 'post',
    body: JSON.stringify(STATIC_USER_DATA),
    headers: { 'Content-Type': 'application/json' },
  }).then(res => res.json());
}
