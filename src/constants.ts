import Constants from 'expo-constants';
import type { TUser } from './types';

const { manifest } = Constants;

export const BASE_URL = `http://${manifest.debuggerHost?.split(':')[0]}:8000`;

export const STATIC_USER_DATA: Partial<TUser> = {
  username: 'gustavoaz7',
  profilePicUrl: 'https://avatars.githubusercontent.com/u/28453820?v=4',
};

export const FRAME_TIME = 10;
