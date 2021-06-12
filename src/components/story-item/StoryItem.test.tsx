import React from 'react';
import {
  render,
  RenderOptions,
  fireEvent,
  act,
} from '@testing-library/react-native';
import { Animated, TextInput } from 'react-native';
import MockDate from 'mockdate';
import { StoryItem, STORY_TIMEOUT } from './StoryItem';
import { Providers } from '../../Providers';
import { generateMockStory } from '../../data';
import {
  setupTimeTravel,
  destroyTimeTravel,
  timeTravel,
} from '../../test/time-travel';
import { SCREEN_WIDTH } from '../../utils/dimensions';

const story = generateMockStory();

describe('components - StoryItem', () => {
  const options: RenderOptions = { wrapper: Providers };
  const defaultProps = {
    story,
    storyIndex: 0,
    isCurrentStory: true,
    goToStory: jest.fn(),
  };

  beforeEach(() => {
    setupTimeTravel();
    defaultProps.goToStory.mockClear();
  });

  afterEach(() => {
    destroyTimeTravel();
  });

  it('renders', () => {
    render(<StoryItem {...defaultProps} />, options);
  });

  it('matches snapshot', () => {
    MockDate.set(story.medias[0].takenAt + 3600 * 1000);
    const { toJSON } = render(<StoryItem {...defaultProps} />, options);

    expect(toJSON()).toMatchSnapshot();
  });

  it('starts all progress bars at 0', () => {
    const { getByTestId } = render(<StoryItem {...defaultProps} />, options);

    getByTestId('StoryItem-ProgressBar')
      .findAllByType(Animated.View)
      .forEach(progressBar => {
        expect(progressBar.props.style[1]).toMatchInlineSnapshot(`
          Object {
            "width": "0%",
          }
        `);
      });
  });

  describe('when it is not the current story', () => {
    it('does not animate progress bar', () => {
      const { getByTestId } = render(
        <StoryItem {...defaultProps} isCurrentStory={false} />,
        options,
      );

      const progressBarProps = getByTestId(
        'StoryItem-ProgressBar',
      ).findAllByType(Animated.View)[0].props;

      expect(progressBarProps.style[1]).toMatchInlineSnapshot(`
        Object {
          "width": "0%",
        }
      `);

      act(() => {
        timeTravel(STORY_TIMEOUT);
      });

      expect(progressBarProps.style[1]).toMatchInlineSnapshot(`
        Object {
          "width": "0%",
        }
      `);
    });

    it('does not change story image', () => {
      const { getByTestId } = render(
        <StoryItem {...defaultProps} isCurrentStory={false} />,
        options,
      );

      expect(getByTestId('StoryItem-Image').props.source.uri).toBe(
        story.medias[0].url,
      );

      act(() => {
        timeTravel(STORY_TIMEOUT);
      });

      expect(getByTestId('StoryItem-Image').props.source.uri).toBe(
        story.medias[0].url,
      );
    });
  });

  describe('when `shouldPauseAnimations` is true"', () => {
    it('pauses progress', () => {
      const { getByTestId, rerender } = render(
        <StoryItem {...defaultProps} />,
        options,
      );

      const progressBarProps = getByTestId(
        'StoryItem-ProgressBar',
      ).findAllByType(Animated.View)[0].props;

      act(() => {
        timeTravel(STORY_TIMEOUT / 2);
      });

      rerender(<StoryItem {...defaultProps} shouldPauseAnimations />);

      act(() => {
        timeTravel(STORY_TIMEOUT / 2);
      });

      // eslint-disable-next-line no-underscore-dangle
      expect((progressBarProps.style[1].width as any).__getValue()).toMatch(
        /50.\d+%/,
      );
    });

    it('does not change story image', () => {
      const { getByTestId } = render(
        <StoryItem {...defaultProps} shouldPauseAnimations />,
        options,
      );

      expect(getByTestId('StoryItem-Image').props.source.uri).toBe(
        story.medias[0].url,
      );

      act(() => {
        timeTravel(STORY_TIMEOUT);
      });

      expect(getByTestId('StoryItem-Image').props.source.uri).toBe(
        story.medias[0].url,
      );
    });
  });

  it('animates progress bar', () => {
    const { getByTestId } = render(<StoryItem {...defaultProps} />, options);

    const progressBarProps = getByTestId('StoryItem-ProgressBar').findAllByType(
      Animated.View,
    )[0].props;

    expect(progressBarProps.style[1]).toMatchInlineSnapshot(`
      Object {
        "width": "0%",
      }
    `);

    act(() => {
      timeTravel(STORY_TIMEOUT / 2);
    });

    expect(progressBarProps.style[1]).toMatchInlineSnapshot(`
      Object {
        "width": "50%",
      }
    `);

    act(() => {
      timeTravel(STORY_TIMEOUT / 2);
    });

    expect(progressBarProps.style[1]).toMatchInlineSnapshot(`
      Object {
        "width": "100%",
      }
    `);
  });

  describe(`when ${STORY_TIMEOUT}ms have ellapsed`, () => {
    it('changes story image', () => {
      const { getByTestId } = render(<StoryItem {...defaultProps} />, options);

      expect(getByTestId('StoryItem-Image').props.source.uri).toBe(
        story.medias[0].url,
      );

      act(() => {
        timeTravel(STORY_TIMEOUT);
      });

      expect(getByTestId('StoryItem-Image').props.source.uri).toBe(
        story.medias[1].url,
      );
    });

    it('animates next progress bar', () => {
      const { getByTestId } = render(<StoryItem {...defaultProps} />, options);

      const [prevProgressBar, currentProgressBar] = getByTestId(
        'StoryItem-ProgressBar',
      ).findAllByType(Animated.View);

      act(() => {
        timeTravel(STORY_TIMEOUT);
      });

      expect(prevProgressBar.props.style[1]).toMatchInlineSnapshot(`
        Object {
          "width": "100%",
        }
      `);

      expect(currentProgressBar.props.style[1]).toMatchInlineSnapshot(`
        Object {
          "width": "0%",
        }
      `);

      act(() => {
        timeTravel(STORY_TIMEOUT);
      });

      expect(currentProgressBar.props.style[1]).toMatchInlineSnapshot(`
        Object {
          "width": "100%",
        }
      `);
    });
  });

  it('starts correctly at provided `initialMediaIndex`', () => {
    const { getByTestId } = render(
      <StoryItem {...defaultProps} initialMediaIndex={1} />,
      options,
    );

    expect(getByTestId('StoryItem-Image').props.source.uri).toBe(
      story.medias[1].url,
    );

    const [firstProgressBar, currentProgressBar] = getByTestId(
      'StoryItem-ProgressBar',
    ).findAllByType(Animated.View);

    expect(firstProgressBar.props.style[1]).toMatchInlineSnapshot(`
      Object {
        "width": "100%",
      }
    `);

    expect(currentProgressBar.props.style[1]).toMatchInlineSnapshot(`
      Object {
        "width": "0%",
      }
    `);
  });

  it('pauses progress on long press and resumes on press out', () => {
    const { getByTestId } = render(<StoryItem {...defaultProps} />, options);

    const container = getByTestId('StoryItem');
    const progressBarProps = getByTestId('StoryItem-ProgressBar').findAllByType(
      Animated.View,
    )[0].props;

    fireEvent(container, 'onLongPress');

    act(() => {
      timeTravel(STORY_TIMEOUT);
    });

    // eslint-disable-next-line no-underscore-dangle
    expect((progressBarProps.style[1].width as any).__getValue()).toMatch(
      /0.\d+%/,
    );
    expect(getByTestId('StoryItem-Image').props.source.uri).toBe(
      story.medias[0].url,
    );

    fireEvent(container, 'onPressOut');

    act(() => {
      timeTravel(STORY_TIMEOUT);
    });

    // eslint-disable-next-line no-underscore-dangle
    expect((progressBarProps.style[1].width as any).__getValue()).toBe('100%');
    expect(getByTestId('StoryItem-Image').props.source.uri).toBe(
      story.medias[1].url,
    );
  });

  it('pauses progress when input is focused and resumes on blur', () => {
    const { getByTestId, UNSAFE_getByType } = render(
      <StoryItem {...defaultProps} />,
      options,
    );

    const input = UNSAFE_getByType(TextInput);
    const progressBarProps = getByTestId('StoryItem-ProgressBar').findAllByType(
      Animated.View,
    )[0].props;

    fireEvent(input, 'onFocus');

    act(() => {
      timeTravel(STORY_TIMEOUT);
    });

    /* eslint-disable no-underscore-dangle */
    expect((progressBarProps.style[1].width as any).__getValue()).toMatch(
      /0.00\d+%/,
    );
    expect(getByTestId('StoryItem-Image').props.source.uri).toBe(
      story.medias[0].url,
    );

    fireEvent(input, 'onBlur');

    act(() => {
      timeTravel(STORY_TIMEOUT);
    });

    expect((progressBarProps.style[1].width as any).__getValue()).toBe('100%');
    expect(getByTestId('StoryItem-Image').props.source.uri).toBe(
      story.medias[1].url,
    );
    /* eslint-enable no-underscore-dangle */
  });

  describe('when at an intermediary media', () => {
    const mediaIndex = 1;

    describe('on left side press', () => {
      it('goes to previous media', () => {
        const { getByTestId } = render(
          <StoryItem {...defaultProps} initialMediaIndex={mediaIndex} />,
          options,
        );

        fireEvent(getByTestId('StoryItem'), 'onPress', {
          nativeEvent: { locationX: SCREEN_WIDTH / 2 - 1 },
        });

        expect(getByTestId('StoryItem-Image').props.source.uri).toBe(
          story.medias[mediaIndex - 1].url,
        );
      });

      it('resets current progress bar and starts previous from 0', () => {
        const { getByTestId } = render(
          <StoryItem {...defaultProps} initialMediaIndex={mediaIndex} />,
          options,
        );

        fireEvent(getByTestId('StoryItem'), 'onPress', {
          nativeEvent: { locationX: SCREEN_WIDTH / 2 - 1 },
        });

        const [firstProgressBar, secondProgressBar] = getByTestId(
          'StoryItem-ProgressBar',
        ).findAllByType(Animated.View);

        expect(firstProgressBar.props.style[1]).toMatchInlineSnapshot(`
          Object {
            "width": "0%",
          }
        `);

        expect(secondProgressBar.props.style[1]).toMatchInlineSnapshot(`
          Object {
            "width": "0%",
          }
        `);
      });
    });

    describe('on right side press', () => {
      it('goes to previous media', () => {
        const { getByTestId } = render(
          <StoryItem {...defaultProps} initialMediaIndex={mediaIndex} />,
          options,
        );

        fireEvent(getByTestId('StoryItem'), 'onPress', {
          nativeEvent: { locationX: SCREEN_WIDTH / 2 + 1 },
        });

        expect(getByTestId('StoryItem-Image').props.source.uri).toBe(
          story.medias[mediaIndex + 1].url,
        );
      });

      it('completes current progress bar and starts next from 0', () => {
        const { getByTestId } = render(
          <StoryItem {...defaultProps} initialMediaIndex={mediaIndex} />,
          options,
        );

        fireEvent(getByTestId('StoryItem'), 'onPress', {
          nativeEvent: { locationX: SCREEN_WIDTH / 2 + 1 },
        });

        const [, secondProgressBar, thirdProgressBar] = getByTestId(
          'StoryItem-ProgressBar',
        ).findAllByType(Animated.View);

        expect(secondProgressBar.props.style[1]).toMatchInlineSnapshot(`
          Object {
            "width": "100%",
          }
        `);

        expect(thirdProgressBar.props.style[1]).toMatchInlineSnapshot(`
          Object {
            "width": "0%",
          }
        `);
      });
    });
  });

  describe('when at last media', () => {
    const storyIndex = Math.random();

    it(`calls "goToStory" with next storyIndex after ${STORY_TIMEOUT}ms`, () => {
      render(
        <StoryItem
          {...defaultProps}
          initialMediaIndex={story.medias.length - 1}
          storyIndex={storyIndex}
        />,
        options,
      );

      act(() => {
        timeTravel(STORY_TIMEOUT);
      });

      expect(defaultProps.goToStory).toHaveBeenCalledTimes(1);
      expect(defaultProps.goToStory).toHaveBeenCalledWith(storyIndex + 1);
    });

    it(`calls "goToStory" with next storyIndex on right press`, () => {
      const { getByTestId } = render(
        <StoryItem
          {...defaultProps}
          initialMediaIndex={story.medias.length - 1}
          storyIndex={storyIndex}
        />,
        options,
      );

      fireEvent(getByTestId('StoryItem'), 'onPress', {
        nativeEvent: { locationX: SCREEN_WIDTH / 2 + 1 },
      });

      expect(defaultProps.goToStory).toHaveBeenCalledTimes(1);
      expect(defaultProps.goToStory).toHaveBeenCalledWith(storyIndex + 1);
    });
  });

  describe('when at first media', () => {
    const storyIndex = Math.random();

    it(`calls "goToStory" with previous storyIndex on left side press`, () => {
      const { getByTestId } = render(
        <StoryItem {...defaultProps} storyIndex={storyIndex} />,
        options,
      );

      fireEvent(getByTestId('StoryItem'), 'onPress', {
        nativeEvent: { locationX: SCREEN_WIDTH / 2 - 1 },
      });

      expect(defaultProps.goToStory).toHaveBeenCalledTimes(1);
      expect(defaultProps.goToStory).toHaveBeenCalledWith(storyIndex - 1);
    });
  });
});
