import React from 'react';
import { Image, Animated } from 'react-native';
import { render, act } from '@testing-library/react-native';
import { TapGestureHandler, State } from 'react-native-gesture-handler';
import { PostItemImage } from './PostItemImage';
import { Providers } from '../../../Providers';
import {
  generateMockPostMedia,
  generateMockTappableObject,
} from '../../../data';
import { theme } from '../../../styles/theme';
import {
  destroyTimeTravel,
  setupTimeTravel,
  timeTravel,
} from '../../../test/time-travel';

describe('components - PostItemImage', () => {
  const options = { wrapper: Providers };
  const media = generateMockPostMedia();

  it('renders ', () => {
    render(<PostItemImage media={media} />, options);
  });

  it('matches snapshot', () => {
    const { toJSON } = render(<PostItemImage media={media} />, options);

    expect(toJSON()).toMatchSnapshot();
  });

  it('renders image', () => {
    const { UNSAFE_getByType } = render(
      <PostItemImage media={media} />,
      options,
    );

    expect(UNSAFE_getByType(Image).props.source.uri).toEqual(media.url);
  });

  describe('when post has no mention', () => {
    it('does nothing on single-tap', async () => {
      const { UNSAFE_getByType, queryByTestId } = render(
        <PostItemImage media={media} />,
        options,
      );

      await act(async () => {
        UNSAFE_getByType(TapGestureHandler).props.onHandlerStateChange({
          nativeEvent: { state: State.ACTIVE },
        });
      });

      expect(queryByTestId('MentionTag')).toBeNull();
    });
  });

  describe('when post has mentions', () => {
    const mediaWithMention: ReturnType<typeof generateMockPostMedia> = {
      ...generateMockPostMedia(),
      tappableObjects: [generateMockTappableObject()],
    };
    const mediaWithMentions: ReturnType<typeof generateMockPostMedia> = {
      ...generateMockPostMedia(),
      tappableObjects: [
        generateMockTappableObject({
          x: 0.1,
          y: 0.2,
          scale: 0.3,
          rotation: 40,
        }),
        generateMockTappableObject({
          x: 0.2,
          y: 0.3,
          scale: 0.4,
          rotation: 50,
        }),
      ],
    };

    it('renders mention tag on single-tap', async () => {
      const { UNSAFE_getByType, queryByTestId } = render(
        <PostItemImage media={mediaWithMention} />,
        options,
      );

      await act(async () => {
        UNSAFE_getByType(TapGestureHandler).props.onHandlerStateChange({
          nativeEvent: { state: State.ACTIVE },
        });
      });

      expect(queryByTestId('MentionTag')).not.toBeNull();
    });

    it('hides mention tag on second single-tap', async () => {
      setupTimeTravel();
      const { UNSAFE_getByType, queryByTestId } = render(
        <PostItemImage media={mediaWithMention} />,
        options,
      );

      await act(async () => {
        UNSAFE_getByType(TapGestureHandler).props.onHandlerStateChange({
          nativeEvent: { state: State.ACTIVE },
        });
      });

      expect(queryByTestId('MentionTag')).not.toBeNull();

      await act(async () => {
        UNSAFE_getByType(TapGestureHandler).props.onHandlerStateChange({
          nativeEvent: { state: State.ACTIVE },
        });
        timeTravel(theme.animation.timingFast);
      });

      expect(queryByTestId('MentionTag')).toBeNull();
      destroyTimeTravel();
    });

    it('renders multiple mention tags on single-tap', async () => {
      const { UNSAFE_getByType, queryAllByTestId } = render(
        <PostItemImage media={mediaWithMentions} />,
        options,
      );

      await act(async () => {
        UNSAFE_getByType(TapGestureHandler).props.onHandlerStateChange({
          nativeEvent: { state: State.ACTIVE },
        });
      });

      expect(queryAllByTestId('MentionTag')).toHaveLength(
        mediaWithMentions.tappableObjects.length,
      );
    });

    it('renders mention tags with provided config', async () => {
      const {
        UNSAFE_getByType,
        UNSAFE_getAllByType,
        queryAllByTestId,
      } = render(<PostItemImage media={mediaWithMentions} />, options);

      await act(async () => {
        UNSAFE_getByType(TapGestureHandler).props.onHandlerStateChange({
          nativeEvent: { state: State.ACTIVE },
        });
      });

      UNSAFE_getAllByType(Animated.View).forEach((animatedView, i) => {
        const tappable = mediaWithMentions.tappableObjects[i];

        expect(animatedView.props.style[0]).toEqual(
          expect.objectContaining({
            top: `${tappable.y * 100}%`,
            left: `${tappable.x * 100}%`,
          }),
        );
      });

      queryAllByTestId('MentionTag').forEach((tag, i) => {
        const tappable = mediaWithMentions.tappableObjects[i];

        expect(tag.props).toEqual(
          expect.objectContaining({
            rotation: tappable.rotation,
            scale: tappable.scale,
          }),
        );
        expect(tag).toHaveTextContent(tappable.text);
      });
    });
  });
});
