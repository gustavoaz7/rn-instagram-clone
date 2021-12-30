import React, { memo, useCallback, useMemo, useState } from 'react';
import styled, { useTheme } from 'styled-components/native';
import { View, Animated } from 'react-native';
import {
  TapGestureHandler,
  State,
  HandlerStateChangeEvent,
  TapGestureHandlerEventPayload,
  TapGestureHandlerProps,
} from 'react-native-gesture-handler';
import { SCREEN_WIDTH } from '../../../utils/dimensions';
import { TPostMedia } from '../../../types';
import { MentionTag } from '../../mention-tag';

type TPostItemImageProps = {
  media: TPostMedia;
  waitFor?: TapGestureHandlerProps['waitFor'];
};

export const PostItemImage = memo(
  ({ media, waitFor }: TPostItemImageProps): JSX.Element => {
    const theme = useTheme();
    const [showTags, setShowTags] = useState(false);
    const tagScale = useMemo(() => new Animated.Value(0), []);

    const onSingleTapMedia = useCallback(
      (e: HandlerStateChangeEvent<TapGestureHandlerEventPayload>) => {
        if (e.nativeEvent.state !== State.ACTIVE) return;
        const wasShowingTags = showTags;
        setShowTags(true);

        Animated.timing(tagScale, {
          toValue: showTags ? 0 : 1,
          duration: theme.animation.timingFast,
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished) {
            setShowTags(!wasShowingTags);
          }
        });
      },
      [showTags, tagScale, theme.animation],
    );

    return (
      <TapGestureHandler
        onHandlerStateChange={onSingleTapMedia}
        waitFor={waitFor}
      >
        <View testID="PostItemImage">
          <Image source={{ uri: media.url }} />
          {showTags
            ? media.tappableObjects
                .filter(tappable => tappable.type === 'mention')
                .map(tappable => (
                  <AnimatedMentionTag
                    key={tappable.id}
                    style={{ transform: [{ scale: tagScale }] }}
                    {...{ top: tappable.y, left: tappable.x }}
                  >
                    <MentionTag {...tappable} />
                  </AnimatedMentionTag>
                ))
            : null}
        </View>
      </TapGestureHandler>
    );
  },
);

const Image = styled.Image`
  width: ${SCREEN_WIDTH}px;
  height: ${SCREEN_WIDTH}px;
`;

const AnimatedMentionTag = styled(Animated.View)<{ top: number; left: number }>`
  position: absolute;
  ${({ top, left }) => `
    top: ${top * 100}%;
    left: ${left * 100}%;
  `}
`;
