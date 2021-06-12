import MockDate from 'mockdate';
import { FRAME_TIME } from '../constants';

export const setupTimeTravel = () => {
  MockDate.set(0);
  jest.useFakeTimers();
};

export const destroyTimeTravel = () => {
  MockDate.reset();
  jest.useRealTimers();
};

export const timeTravel = (milliseconds = FRAME_TIME) => {
  const tickTravel = () => {
    const now = Date.now();
    MockDate.set(new Date(now + FRAME_TIME));
    jest.advanceTimersByTime(FRAME_TIME);
  };

  const frames = milliseconds / FRAME_TIME;
  for (let i = 0; i < frames; i += 1) {
    tickTravel();
  }
};
