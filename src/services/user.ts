import { BASE_URL, STATIC_USER_DATA } from '../constants';
import type { TProfile, TUser } from '../types';
import { makeFail, makeSuccess, RemoteData } from '../utils/remote-data';

export type TFakeLoginBody = typeof STATIC_USER_DATA;
export type TFakeLoginResponse = TUser;
export type TRemoteUser = RemoteData<TFakeLoginResponse, Error>;
export async function fakeLogin(): Promise<TRemoteUser> {
  try {
    const user = await fetch(`${BASE_URL}/user/login`, {
      method: 'post',
      body: JSON.stringify(STATIC_USER_DATA),
      headers: { 'Content-Type': 'application/json' },
    }).then(res => res.json());

    return makeSuccess(user);
  } catch (e) {
    return makeFail(e);
  }
}

export type TProfileResponse = TProfile;
export type TRemoteProfile = RemoteData<TProfileResponse, Error>;
export async function fetchProfile(username: string): Promise<TRemoteProfile> {
  try {
    const profile = await fetch(
      `${BASE_URL}/user/${username}/profile`,
    ).then(res => res.json());

    return makeSuccess(profile);
  } catch (e) {
    return makeFail(e);
  }
}
