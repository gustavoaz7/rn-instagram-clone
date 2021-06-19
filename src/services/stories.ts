import { BASE_URL } from '../constants';
import type { TStory } from '../types';

export async function fetchStories(): Promise<TStory[]> {
  return fetch(`${BASE_URL}/stories`).then(res => res.json());
}
