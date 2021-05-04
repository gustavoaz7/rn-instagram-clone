import React from 'react';
import styled, { css } from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '../text';
import { SCREEN_WIDTH } from '../../utils/dimensions';
import MenuVerticalSvg from '../../../assets/svg/menu-vertical.svg';
import CommentSvg from '../../../assets/svg/comment.svg';
import HeartSvg from '../../../assets/svg/heart.svg';
import DirectSvg from '../../../assets/svg/direct.svg';
import BookmarkSvg from '../../../assets/svg/bookmark.svg';

export function PostItem(): JSX.Element {
  return (
    <Container>
      <Header>
        <Row>
          <StatusRing>
            <AvatarInnerRing>
              <Avatar
                source={{
                  uri: 'https://cdn.fakercloud.com/avatars/spbroma_128.jpg',
                }}
              />
            </AvatarInnerRing>
          </StatusRing>
          <TitleContainer>
            <BoldText>Username</BoldText>
            <Subtitle>Location</Subtitle>
          </TitleContainer>
        </Row>
        <MenuVerticalSvg color="black" />
      </Header>
      <PostImage source={{ uri: 'http://placeimg.com/640/480/abstract' }} />
      <Footer>
        <ActionsRow>
          <Row>
            <Heart color="black" />
            <Comment color="black" />
            <Direct color="black" />
          </Row>
          <BookmarkSvg color="black" />
        </ActionsRow>
        <BoldText>123 likes</BoldText>
        <Text>
          <BoldText>Username </BoldText>
          legend
        </Text>
        {/* TODO: comments */}
        <Time>Formatted time</Time>
      </Footer>
    </Container>
  );
}

const centerStyle = css`
  align-items: center;
  justify-content: center;
`;
const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;
const Container = styled.View`
  width: 100%;
`;

const Header = styled.View`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.m}`};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const StatusRing = styled(LinearGradient).attrs(({ theme }) => ({
  colors: [theme.color.purpleRed, theme.color.yellow],
  start: { x: 0.7, y: 0.3 },
  end: { x: 0.3, y: 0.7 },
}))`
  width: 40px;
  height: 40px;
  border-radius: 40px;
  ${centerStyle};
`;

const AvatarInnerRing = styled.View`
  width: 37px;
  height: 37px;
  border-radius: 37px;
  ${centerStyle};
  background-color: ${({ theme }) => theme.color.white};
`;

const Avatar = styled.Image`
  width: 33px;
  height: 33px;
  border-radius: 33px;
`;

const TitleContainer = styled.View`
  margin-left: ${({ theme }) => theme.spacing.s};
`;

const BoldText = styled(Text)`
  font-weight: bold;
`;

const Subtitle = styled(Text)`
  font-size: ${({ theme }) => theme.font.size.s};
  line-height: 14px;
`;

const Footer = styled.View`
  padding: 0 ${({ theme }) => theme.spacing.m};
`;

const PostImage = styled.Image`
  width: ${SCREEN_WIDTH}px;
  height: ${SCREEN_WIDTH}px;
`;

const ActionsRow = styled(Row)`
  padding: ${({ theme }) => `${theme.spacing.s} 0`};
  justify-content: space-between;
`;

const actionsSvgStyle = css`
  margin-right: ${({ theme }) => theme.spacing.l};
`;

const Heart = styled(HeartSvg)`
  ${actionsSvgStyle};
`;

const Comment = styled(CommentSvg)`
  ${actionsSvgStyle};
`;

const Direct = styled(DirectSvg)`
  ${actionsSvgStyle};
`;

const Time = styled(Text)`
  ${({ theme }) => `
    font-size: ${theme.font.size.s};
    color: ${theme.color.gray}
    margin-top: ${theme.spacing.xs}
  `};
`;
