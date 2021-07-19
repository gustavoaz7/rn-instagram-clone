import { BASE_URL } from '../constants';
import type { TStory } from '../types';
import { makeFail, makeSuccess, RemoteData } from '../utils/remote-data';

export type TStoriesResponse = TStory[];
export type TRemoteStories = RemoteData<TStoriesResponse, Error>;
export async function fetchStories(): Promise<TRemoteStories> {
  try {
    const stories = await fetch(`${BASE_URL}/stories`).then(res => res.json());

    return makeSuccess(stories);
  } catch (e) {
    return makeFail(e);
  }
}
