import React, { memo, useCallback, useMemo, useState } from 'react';
import styled, { useTheme } from 'styled-components/native';
import { ViewProps, Animated, Pressable } from 'react-native';
import Toast from 'react-native-root-toast';
import { Text } from '../text';
import { AvatarWithRing } from '../avatar-with-ring';
import HeartSvg from '../../../assets/svg/heart.svg';
import { TComment } from '../../types';
import { pluralizeWithS } from '../../utils/string';
import { dateToString } from '../../utils/date';
import { postLike } from '../../services/likes';
import { isFail } from '../../utils/remote-data';

export const AVATAR_SIZE = 40;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type TCommentProps = TComment & {
  interactable?: boolean;
  style?: ViewProps['style'];
};

export const Comment = memo(function Comment({
  id,
  owner,
  previewLikes,
  createdAt,
  text,
  viewerHasLiked,
  interactable = true,
  style,
}: TCommentProps): JSX.Element {
  const theme = useTheme();
  const [isLiked, setIsLiked] = useState(viewerHasLiked);
  const heartScale = useMemo(() => new Animated.Value(1), []);
  const [isLikeDisabled, setIsLikeDisabled] = useState(false);

  const likeComment = useCallback(
    async (flag: boolean) => {
      setIsLikeDisabled(true);
      const result = await postLike({ flag, id, collection: 'comments' });
      if (isFail(result)) {
        Toast.show('Failed to like comment.', {
          position: Toast.positions.CENTER,
        });
        setIsLiked(prevIsLiked => !prevIsLiked);
      }
      setIsLikeDisabled(false);
    },
    [id],
  );

  const handleLikeComment = useCallback(() => {
    setIsLiked(prevIsLiked => {
      likeComment(!prevIsLiked);
      heartScale.setValue(theme.animation.heart.initialScale);
      Animated.spring(heartScale, theme.animation.heart.springConfig).start();
      return !prevIsLiked;
    });
  }, [likeComment, heartScale, theme.animation.heart]);

  return (
    <Container testID="Comment" style={style}>
      <AvatarWithRing
        size={AVATAR_SIZE}
        color="gradient"
        imageUrl={owner.profilePicUrl}
      />
      <CommentContainer>
        <CommentText>
          <BoldText>{owner.username} </BoldText>
          {text}
        </CommentText>
        <Row>
          <CommentStats>{dateToString(new Date(createdAt), true)}</CommentStats>
          {interactable ? (
            <>
              {previewLikes.count > 0 ? (
                <CommentStats>
                  {previewLikes.count}{' '}
                  {pluralizeWithS('like', previewLikes.count)}
                </CommentStats>
              ) : null}
              <CommentStats>Reply</CommentStats>
            </>
          ) : null}
        </Row>
      </CommentContainer>
      {interactable ? (
        <AnimatedPressable
          disabled={isLikeDisabled}
          onPress={handleLikeComment}
          style={{ transform: [{ scale: heartScale }] }}
        >
          <HeartIcon
            color={isLiked ? theme.color.red : theme.color.gray}
            fill={isLiked ? theme.color.red : 'none'}
            testID="Comment-Heart"
          />
        </AnimatedPressable>
      ) : null}
    </Container>
  );
});

const Row = styled.View`
  flex-direction: row;
`;

const BoldText = styled(Text)`
  font-weight: bold;
`;

const Container = styled(Row)`
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.spacing.l};
`;

const CommentStats = styled(BoldText)`
  color: ${({ theme }) => theme.color.gray};
  margin-right: ${({ theme }) => theme.spacing.m};
  font-size: ${({ theme }) => theme.font.size.s};
`;

const CommentContainer = styled.View`
  flex: 1;
  padding-left: ${({ theme }) => theme.spacing.m};
`;

const CommentText = styled(Text)`
  margin-right: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const HeartIcon = styled(HeartSvg).attrs(() => ({
  width: 16,
  height: 16,
}))`
  margin-top: ${({ height }) => AVATAR_SIZE / 2 - height / 2}px;
`;
