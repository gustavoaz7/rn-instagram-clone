import { BASE_URL, STATIC_USER_DATA } from '../constants';
import type { TPost, TUser } from '../types';

export async function fakeLogin(): Promise<TUser> {
  return fetch(`${BASE_URL}/configure`, {
    method: 'post',
    body: JSON.stringify(STATIC_USER_DATA),
    headers: { 'Content-Type': 'application/json' },
  }).then(res => res.json());
}

export async function fetchPosts(): Promise<TPost[]> {
  return fetch(`${BASE_URL}/posts`).then(res => res.json());
}
