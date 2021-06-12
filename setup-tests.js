import 'jest-styled-components';
import '@testing-library/jest-native/extend-expect';
import { enableFetchMocks } from 'jest-fetch-mock';
import { FRAME_TIME } from './src/constants';

jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');
enableFetchMocks();

global.requestAnimationFrame = callback => setTimeout(callback, FRAME_TIME);
