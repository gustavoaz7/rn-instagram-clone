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
import { EMOJIS } from '../../constants';

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

  it('renders fake-input instead of real one', () => {
    const { getByTestId, UNSAFE_queryByType } = render(
      <StoryItem {...defaultProps} />,
      options,
    );

    expect(getByTestId('StoryItem-FakeInput')).toBeTruthy();
    expect(UNSAFE_queryByType(TextInput)).toBeFalsy();
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

      expect(progressBarProps.style[1]).toMatchInlineSnapshot(`
        Object {
          "width": "50%",
        }
      `);
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

    expect(progressBarProps.style[1]).toMatchInlineSnapshot(`
      Object {
        "width": "0%",
      }
    `);
    expect(getByTestId('StoryItem-Image').props.source.uri).toBe(
      story.medias[0].url,
    );

    fireEvent(container, 'onPressOut');

    act(() => {
      timeTravel(STORY_TIMEOUT);
    });

    expect(progressBarProps.style[1]).toMatchInlineSnapshot(`
      Object {
        "width": "100%",
      }
    `);
    expect(getByTestId('StoryItem-Image').props.source.uri).toBe(
      story.medias[1].url,
    );
  });

  describe('when fake-input is pressed', () => {
    it('pauses progress when fake-input is pressed', () => {
      const { getByTestId } = render(<StoryItem {...defaultProps} />, options);

      const progressBarProps = getByTestId(
        'StoryItem-ProgressBar',
      ).findAllByType(Animated.View)[0].props;

      fireEvent.press(getByTestId('StoryItem-FakeInput'));

      act(() => {
        timeTravel(STORY_TIMEOUT);
      });

      expect(progressBarProps.style[1]).toMatchInlineSnapshot(`
        Object {
          "width": "0%",
        }
      `);
      expect(getByTestId('StoryItem-Image').props.source.uri).toBe(
        story.medias[0].url,
      );
    });

    it('renders real input instead of fake one', () => {
      const { getByTestId, queryByTestId, UNSAFE_queryByType } = render(
        <StoryItem {...defaultProps} />,
        options,
      );
      fireEvent.press(getByTestId('StoryItem-FakeInput'));

      expect(UNSAFE_queryByType(TextInput)).toBeTruthy();
      expect(queryByTestId('StoryItem-FakeInput')).toBeFalsy();
    });

    it('renders emojis list', () => {
      const { getByTestId, getByText } = render(
        <StoryItem {...defaultProps} />,
        options,
      );
      fireEvent.press(getByTestId('StoryItem-FakeInput'));

      EMOJIS.forEach(emoji => {
        expect(getByText(emoji)).toBeTruthy();
      });
    });

    describe('when input is not empty', () => {
      it('hides emojis list', () => {
        const { getByTestId, queryByText, UNSAFE_getByType } = render(
          <StoryItem {...defaultProps} />,
          options,
        );
        fireEvent.press(getByTestId('StoryItem-FakeInput'));

        fireEvent.changeText(UNSAFE_getByType(TextInput), 'text');

        EMOJIS.forEach(emoji => {
          expect(queryByText(emoji)).toBeFalsy();
        });
      });
    });

    describe('when input is blurred', () => {
      it('resumes previous state', () => {
        const {
          getByTestId,
          queryByTestId,
          UNSAFE_getByType,
          UNSAFE_queryByType,
          queryByText,
        } = render(<StoryItem {...defaultProps} />, options);
        const progressBarProps = getByTestId(
          'StoryItem-ProgressBar',
        ).findAllByType(Animated.View)[0].props;

        fireEvent.press(getByTestId('StoryItem-FakeInput'));
        fireEvent(UNSAFE_getByType(TextInput), 'onBlur');

        act(() => {
          timeTravel(STORY_TIMEOUT);
        });

        expect(progressBarProps.style[1]).toMatchInlineSnapshot(`
          Object {
            "width": "100%",
          }
        `);
        expect(getByTestId('StoryItem-Image').props.source.uri).toBe(
          story.medias[1].url,
        );
        expect(UNSAFE_queryByType(TextInput)).toBeFalsy();
        expect(queryByTestId('StoryItem-FakeInput')).toBeTruthy();
        EMOJIS.forEach(emoji => {
          expect(queryByText(emoji)).toBeFalsy();
        });
      });
    });
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
