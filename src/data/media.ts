import type { TPostMedia } from '../types';

export const generatePostMedia = (): TPostMedia => ({
  id: `${Math.random()}`,
  url: 'http://placeimg.com/640/480/cats',
  owner: {
    id: `${Math.random()}`,
    profilePicUrl: 'https://avatars.githubusercontent.com/u/28453820?v=4',
    username: 'gustavoaz7',
  },
  tappableObjects: [],
});
