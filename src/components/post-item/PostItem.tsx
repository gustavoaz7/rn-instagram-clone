import React, { memo, useCallback, useState } from 'react';
import styled, { css } from 'styled-components/native';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  TextLayoutEventData,
  ViewProps,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { Text } from '../text';
import { SCREEN_WIDTH } from '../../utils/dimensions';
import MenuVerticalSvg from '../../../assets/svg/menu-vertical.svg';
import CommentSvg from '../../../assets/svg/comment.svg';
import HeartSvg from '../../../assets/svg/heart.svg';
import DirectSvg from '../../../assets/svg/direct.svg';
import BookmarkSvg from '../../../assets/svg/bookmark.svg';
import { TPost } from '../../types';
import { dateToString } from '../../utils/date';
import { THomeStackNavigationProps } from '../../navigation/HomeStackNavigator';
import { ROOT_STACK_SCREENS } from '../../navigation/screens';
import { AvatarWithRing } from '../avatar-with-ring';
import { pluralizeWithS } from '../../utils/string';
import { Pagination } from '../pagination';
import { SliderPageIndicator } from '../slider-page-indicator';

type TPostItemProps = TPost & { style?: ViewProps['style'] };

export const PostItem = memo(function PostItem({
  style,
  ...post
}: TPostItemProps): JSX.Element {
  const {
    owner,
    createdAt,
    medias,
    caption,
    previewLikes,
    previewComments,
    location,
  } = post;
  const navigation = useNavigation<THomeStackNavigationProps>();
  const [captionLines, setCaptionLines] = useState(0);
  const [captionExpanded, setCaptionExpanded] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const handleCaptionLayout = useCallback(
    (e: NativeSyntheticEvent<TextLayoutEventData>) => {
      setCaptionLines(e.nativeEvent.lines.length);
    },
    [],
  );
  const handleCaptionExpand = useCallback(() => {
    setCaptionExpanded(true);
  }, []);
  const handleSeeAllCommentsPress = useCallback(() => {
    navigation.navigate(ROOT_STACK_SCREENS.COMMENTS, { post });
  }, [navigation, post]);

  const handleScroll = useCallback<
    (e: NativeSyntheticEvent<NativeScrollEvent>) => void
  >(({ nativeEvent }) => {
    const { contentOffset } = nativeEvent;
    const viewSize = nativeEvent.layoutMeasurement;

    const newMediaIndex = Math.round(contentOffset.x / viewSize.width);
    setCurrentMediaIndex(newMediaIndex);
  }, []);
  const isMultiImage = medias.length > 1;

  return (
    <Container testID="PostItem" style={style}>
      <Header>
        <Row>
          <AvatarWithRing
            size={40}
            imageUrl={owner.profilePicUrl}
            color="gradient"
          />
          <TitleContainer>
            <BoldText>{owner.username}</BoldText>
            {location ? <Subtitle>{location}</Subtitle> : null}
          </TitleContainer>
        </Row>
        <MenuVerticalIcon />
      </Header>
      <ImageContainer>
        {isMultiImage ? (
          <>
            <SliderPageIndicator
              current={currentMediaIndex + 1}
              total={medias.length}
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              bounces={false}
              overScrollMode="never"
              pagingEnabled
              onScroll={handleScroll}
              testID="PostItem-Slider"
            >
              {medias.map(media => (
                <Image key={media.id} source={{ uri: media.url }} />
              ))}
            </ScrollView>
          </>
        ) : (
          <Image source={{ uri: medias[0].url }} />
        )}
      </ImageContainer>
      <Footer>
        <ActionsRow>
          <Row>
            <HeartIcon />
            <CommentIcon />
            <DirectIcon />
          </Row>
          {isMultiImage ? (
            <StyledPagination
              total={medias.length}
              current={currentMediaIndex}
            />
          ) : null}
          <BookmarkIcon />
        </ActionsRow>
        {previewLikes.count > 0 ? (
          <BoldText>
            {previewLikes.count} {pluralizeWithS('like', previewLikes.count)}
          </BoldText>
        ) : null}
        {caption ? (
          <>
            <Text
              onTextLayout={handleCaptionLayout}
              {...(!captionExpanded && { numberOfLines: 2 })}
              testID="post-caption"
            >
              <BoldText>{owner.username} </BoldText>
              {caption}
            </Text>
            {captionLines > 2 && !captionExpanded ? (
              <WeakText onPress={handleCaptionExpand}>more</WeakText>
            ) : null}
          </>
        ) : null}
        {previewComments.count ? (
          <>
            {previewComments.count > 1 ? (
              <WeakText onPress={handleSeeAllCommentsPress}>
                See all {previewComments.count} comments
              </WeakText>
            ) : null}
            {previewComments.comments.length ? (
              <CommentContainer>
                <Comment>
                  <BoldText>
                    {previewComments.comments[0].owner.username}{' '}
                  </BoldText>
                  {previewComments.comments[0].text}
                </Comment>
                <CommentLike />
              </CommentContainer>
            ) : null}
          </>
        ) : null}
        <Time>{dateToString(new Date(createdAt))}</Time>
      </Footer>
    </Container>
  );
});

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

const ImageContainer = styled.View`
  position: relative;
`;

const Image = styled.Image`
  width: ${SCREEN_WIDTH}px;
  height: ${SCREEN_WIDTH}px;
`;

const StyledPagination = styled(Pagination)`
  ${StyleSheet.absoluteFill};
  justify-content: center;
  align-items: center;
`;

const ActionsRow = styled(Row)`
  padding: ${({ theme }) => `${theme.spacing.s} 0`};
  justify-content: space-between;
`;

const actionsSvgStyle = css`
  margin-right: ${({ theme }) => theme.spacing.m};
`;

const MenuVerticalIcon = styled(MenuVerticalSvg).attrs(({ theme }) => ({
  color: theme.color.black,
}))``;

const HeartIcon = styled(HeartSvg).attrs(({ theme }) => ({
  color: theme.color.black,
}))`
  ${actionsSvgStyle};
`;

const CommentIcon = styled(CommentSvg).attrs(({ theme }) => ({
  color: theme.color.black,
}))`
  ${actionsSvgStyle};
`;

const DirectIcon = styled(DirectSvg).attrs(({ theme }) => ({
  color: theme.color.black,
}))`
  ${actionsSvgStyle};
`;

const BookmarkIcon = styled(BookmarkSvg).attrs(({ theme }) => ({
  color: theme.color.black,
}))``;

const WeakText = styled(Text)`
  color: ${({ theme }) => theme.color.gray};
`;

const Time = styled(WeakText)`
  ${({ theme }) => `
    font-size: ${theme.font.size.s};
    margin-top: ${theme.spacing.xs};
  `};
`;

const CommentContainer = styled(Row)`
  justify-content: space-between;
`;

const Comment = styled(Text).attrs({
  numberOfLines: 2,
})`
  flex: 1;
  margin-right: ${({ theme }) => theme.spacing.xs};
`;

const CommentLike = styled(HeartSvg).attrs(({ theme }) => ({
  color: theme.color.gray,
  width: 16,
  height: 16,
}))``;
