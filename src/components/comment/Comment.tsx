import React, { memo } from 'react';
import styled from 'styled-components/native';
import { Text } from '../text';
import { AvatarWithRing } from '../avatar-with-ring';
import HeartSvg from '../../../assets/svg/heart.svg';
import { TComment } from '../../types';
import { pluralizeWithS } from '../../utils/string';
import { dateToString } from '../../utils/date';

export const AVATAR_SIZE = 40;

type TCommentProps = TComment;

export const Comment = memo(function Comment(
  comment: TCommentProps,
): JSX.Element {
  const likeCount = comment.likedBy.length;
  return (
    <Container>
      <AvatarWithRing
        size={AVATAR_SIZE}
        color="gradient"
        imageUrl={comment.owner.profilePicUrl}
      />
      <CommentContainer>
        <CommentText>
          <BoldText>{comment.owner.username} </BoldText>
          {comment.text}
        </CommentText>
        <Row>
          <CommentStats>
            {dateToString(new Date(comment.createdAt), true)}
          </CommentStats>
          {likeCount > 0 ? (
            <CommentStats>
              {likeCount} {pluralizeWithS('like', likeCount)}
            </CommentStats>
          ) : null}
          <CommentStats>Reply</CommentStats>
        </Row>
      </CommentContainer>
      <HeartIcon />
    </Container>
  );
});

const Row = styled.View`
  flex-direction: row;
`;

const BoldText = styled(Text)`
  font-weight: bold;
`;

const CommentStats = styled(BoldText)`
  color: ${({ theme }) => theme.color.gray};
  margin-right: ${({ theme }) => theme.spacing.m};
  font-size: ${({ theme }) => theme.font.size.s};
`;

const Container = styled(Row)`
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.spacing.l};
`;

const CommentContainer = styled.View`
  flex: 1;
  padding-left: ${({ theme }) => theme.spacing.m};
`;

const CommentText = styled(Text)`
  margin-right: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const HeartIcon = styled(HeartSvg).attrs(({ theme }) => ({
  color: theme.color.gray,
  width: 16,
  height: 16,
}))`
  margin-top: ${({ height }) => AVATAR_SIZE / 2 - height / 2}px;
`;
