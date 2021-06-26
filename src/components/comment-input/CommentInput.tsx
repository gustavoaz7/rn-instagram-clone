import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { EMOJIS } from '../../constants';
import { useUserSelector } from '../../redux/user';
import { SCREEN_WIDTH } from '../../utils/dimensions';
import { AvatarWithRing } from '../avatar-with-ring';
import { Text } from '../text';

export type TCommentInputProps = {
  onSubmit: (text: string) => void;
};

export const CommentInput = ({ onSubmit }: TCommentInputProps): JSX.Element => {
  const { user } = useUserSelector();
  const [text, setText] = useState('');
  const handleTextChange = useCallback(newText => {
    setText(newText);
  }, []);
  const handleEmojiPress = useCallback(
    emoji => {
      setText(`${text}${emoji}`);
    },
    [text],
  );
  const handlePostPress = useCallback(() => {
    onSubmit(text);
  }, [onSubmit, text]);

  return (
    <Container>
      <EmojisRow>
        {EMOJIS.map(emoji => (
          <CommentInput.Emoji
            key={emoji}
            emoji={emoji}
            onPress={handleEmojiPress}
          />
        ))}
      </EmojisRow>
      <InputRow>
        <AvatarWithRing
          size={40}
          color="transparent"
          imageUrl={user?.profilePicUrl}
        />
        <Input
          value={text}
          onChangeText={handleTextChange}
          placeholder="Add a comment..."
          multiline
        />
        <PostButton disabled={!text.length} onPress={handlePostPress}>
          <PostText>Post</PostText>
        </PostButton>
      </InputRow>
    </Container>
  );
};

type TCommentInputEmojiProps = {
  emoji: string;
  onPress: (text: string) => void;
};
CommentInput.Emoji = memo(
  ({ emoji, onPress }: TCommentInputEmojiProps): JSX.Element => {
    const theme = useTheme();
    const [isPressing, setIsPressing] = useState(false);
    const scale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
      Animated.timing(scale, {
        toValue: isPressing ? 0.9 : 1,
        duration: theme.animation.timingFast,
        useNativeDriver: true,
      }).start();
    }, [isPressing, scale, theme.animation.timingFast]);

    return (
      <Animated.View style={{ transform: [{ scale }] }}>
        <EmojiContainer
          onPress={() => onPress(emoji)}
          onPressIn={() => setIsPressing(true)}
          onPressOut={() => setIsPressing(false)}
        >
          <Emoji>{emoji}</Emoji>
        </EmojiContainer>
      </Animated.View>
    );
  },
);

const Container = styled.View``;

const Row = styled.View`
  flex-direction: row;
`;

const EmojisRow = styled(Row)`
  align-items: center;
  border-color: ${({ theme }) => theme.color.gray};
  border-top-width: ${StyleSheet.hairlineWidth}px;
  border-bottom-width: ${StyleSheet.hairlineWidth}px;
`;

const InputRow = styled(Row)`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.m}`};
  align-items: baseline;
`;

const EmojiContainer = styled.Pressable`
  width: ${SCREEN_WIDTH / EMOJIS.length}px;
  height: ${SCREEN_WIDTH / EMOJIS.length}px;
  justify-content: center;
  align-items: center;
`;

const Emoji = styled(Text)`
  font-size: ${SCREEN_WIDTH / (EMOJIS.length * 2)}px;
`;

const Input = styled.TextInput`
  flex: 1;
  padding: 0 ${({ theme }) => theme.spacing.m};
  max-height: 120px;
`;

const PostButton = styled.Pressable`
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

const PostText = styled(Text)`
  color: ${({ theme }) => theme.color.lightBlue};
  padding-bottom: ${({ theme }) => theme.spacing.xs};
`;
