import React, { memo } from 'react';
import styled from 'styled-components/native';
import { ViewProps } from 'react-native';
import { Text } from '../text';
import { AvatarWithRing } from '../avatar-with-ring';
import HeartSvg from '../../../assets/svg/heart.svg';
import { TComment } from '../../types';
import { pluralizeWithS } from '../../utils/string';
import { dateToString } from '../../utils/date';

export const AVATAR_SIZE = 40;

type TCommentProps = TComment & {
  interactable?: boolean;
  style?: ViewProps['style'];
};

export const Comment = memo(function Comment({
  owner,
  previewLikes,
  createdAt,
  text,
  interactable = true,
  style,
}: TCommentProps): JSX.Element {
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
          {(interactable && previewLikes.count > 0 && (
            <>
              <CommentStats>
                {previewLikes.count}{' '}
                {pluralizeWithS('like', previewLikes.count)}
              </CommentStats>
              <CommentStats>Reply</CommentStats>
            </>
          )) ||
            null}
        </Row>
      </CommentContainer>
      {interactable ? <HeartIcon /> : null}
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

const HeartIcon = styled(HeartSvg).attrs(({ theme }) => ({
  color: theme.color.gray,
  width: 16,
  height: 16,
}))`
  margin-top: ${({ height }) => AVATAR_SIZE / 2 - height / 2}px;
`;
