import React from 'react';
import { Animated } from 'react-native';
import { render } from '@testing-library/react-native';
import {
  StoryReactionAnimation,
  ANIMATION_START_Y,
  ANIMATION_END_Y,
} from './StoryReactionAnimation';
import { Providers } from '../../Providers';
import {
  setupTimeTravel,
  destroyTimeTravel,
  timeTravel,
} from '../../test/time-travel';

describe('components - StoryReactionAnimation', () => {
  const options = { wrapper: Providers };
  const props = {
    emoji: '🔥',
    onAnimationComplete: jest.fn(),
  };

  beforeEach(() => {
    setupTimeTravel();
    props.onAnimationComplete.mockReset();
  });

  afterEach(() => {
    destroyTimeTravel();
  });

  it('renders', () => {
    render(<StoryReactionAnimation {...props} />, options);
  });

  it('renders provided emoji', () => {
    const { getAllByText } = render(
      <StoryReactionAnimation {...props} />,
      options,
    );

    expect(getAllByText(props.emoji)[0]).toBeTruthy();
  });

  it('renders emoji with size 20 by default', () => {
    const { getAllByText } = render(
      <StoryReactionAnimation {...props} />,
      options,
    );

    expect(getAllByText(props.emoji)[0]).toHaveStyle({ fontSize: 20 });
  });

  it('renders emoji with provided size', () => {
    const emojiSize = 12;
    const { getAllByText } = render(
      <StoryReactionAnimation {...props} emojiSize={emojiSize} />,
      options,
    );

    expect(getAllByText(props.emoji)[0]).toHaveStyle({ fontSize: emojiSize });
  });

  it('renders 30 emojis by default', () => {
    const { getAllByText } = render(
      <StoryReactionAnimation {...props} />,
      options,
    );

    expect(getAllByText(props.emoji)).toHaveLength(30);
  });

  it('renders provided number of emojis', () => {
    const emojisCount = 99;
    const { getAllByText } = render(
      <StoryReactionAnimation {...props} emojisCount={emojisCount} />,
      options,
    );

    expect(getAllByText(props.emoji)).toHaveLength(emojisCount);
  });

  it('calls onAnimationComplete once completed', () => {
    const duration = 1000;
    render(<StoryReactionAnimation {...props} duration={duration} />, options);

    timeTravel(duration + 1);

    expect(props.onAnimationComplete).toHaveBeenCalled();
  });

  describe('animation', () => {
    it('translates from bottom up', () => {
      const duration = 1000;
      const { UNSAFE_getByType } = render(
        <StoryReactionAnimation {...props} duration={duration} />,
        options,
      );
      const container = UNSAFE_getByType(Animated.View);

      /* eslint-disable no-underscore-dangle */
      expect(container.props.style[1].transform[0].translateY._value).toBe(
        ANIMATION_START_Y,
      );

      timeTravel(duration);

      expect(container.props.style[1].transform[0].translateY._value).toBe(
        ANIMATION_END_Y,
      );
      /* eslint-enable no-underscore-dangle */
    });

    it('fades out', () => {
      const duration = 1000;
      const { UNSAFE_getByType } = render(
        <StoryReactionAnimation {...props} duration={duration} />,
        options,
      );

      /* eslint-disable no-underscore-dangle */
      expect(
        UNSAFE_getByType(Animated.View).props.style[1].opacity._value,
      ).toBe(1);

      timeTravel((duration * 2) / 3);

      expect(
        UNSAFE_getByType(Animated.View).props.style[1].opacity._value,
      ).toBe(1);

      timeTravel(duration / 3);

      expect(
        UNSAFE_getByType(Animated.View).props.style[1].opacity._value,
      ).toBe(0);
      /* eslint-enable no-underscore-dangle */
    });
  });
});
