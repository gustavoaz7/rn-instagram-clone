import React from 'react';
import {
  render,
  RenderOptions,
  fireEvent,
} from '@testing-library/react-native';
import { Animated } from 'react-native';
import { StoryPreviewItem, SCALE_DURATION } from './StoryPreviewItem';
import { Providers } from '../../Providers';
import {
  setupTimeTravel,
  destroyTimeTravel,
  timeTravel,
} from '../../test/time-travel';

describe('components - StoryPreviewItem', () => {
  const options: RenderOptions = { wrapper: Providers };

  beforeEach(() => {
    setupTimeTravel();
  });

  afterEach(() => {
    destroyTimeTravel();
  });

  it('renders', () => {
    render(<StoryPreviewItem />, options);
  });

  it('matches snapshot', () => {
    const { toJSON } = render(<StoryPreviewItem />, options);

    expect(toJSON()).toMatchSnapshot();
  });

  it('bounces on press', () => {
    const { UNSAFE_getByType } = render(<StoryPreviewItem />, options);

    const element = UNSAFE_getByType(Animated.View);
    const animatedScale = element.props.style[1].transform[0].scale;

    fireEvent(element, 'pressIn');
    timeTravel(SCALE_DURATION);

    expect(animatedScale).toMatchInlineSnapshot('0.9');

    fireEvent(element, 'pressOut');
    timeTravel(SCALE_DURATION);

    expect(animatedScale).toMatchInlineSnapshot('1');
  });
});
