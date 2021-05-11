import 'jest-styled-components';
import '@testing-library/jest-native/extend-expect';
import { enableFetchMocks } from 'jest-fetch-mock';

jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');
enableFetchMocks();
