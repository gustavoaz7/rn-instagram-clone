import { BASE_URL, STATIC_USER_DATA } from '../constants';
import type { TUser } from '../types';

export async function fakeLogin(): Promise<TUser> {
  return fetch(`${BASE_URL}/configure`, {
    method: 'post',
    body: JSON.stringify(STATIC_USER_DATA),
    headers: { 'Content-Type': 'application/json' },
  }).then(res => res.json());
}
