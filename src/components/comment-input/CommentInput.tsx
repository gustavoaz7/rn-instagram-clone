import React, { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import { useUserSelector } from '../../redux/user';
import { SCREEN_WIDTH } from '../../utils/dimensions';
import { AvatarWithRing } from '../avatar-with-ring';
import { Text } from '../text';

export const EMOJIS = ['❤️', '🙌', '🔥', '👏', '😢', '😍', '😮', '😂'];

export const CommentInput = (): JSX.Element => {
  const { user } = useUserSelector();
  const [text, setText] = useState('');
  const handleTextChange = useCallback(newText => {
    setText(newText);
  }, []);

  return (
    <Container>
      <EmojisRow>
        {EMOJIS.map(emoji => (
          <EmojiContainer key={emoji}>
            <Emoji>{emoji}</Emoji>
          </EmojiContainer>
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
        <PostButton disabled={!text.length}>
          <PostText>Post</PostText>
        </PostButton>
      </InputRow>
    </Container>
  );
};

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
  padding: ${({ theme }) => `${theme.spacing.s} ${theme.spacing.m}`};
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
