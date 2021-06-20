import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import styled, { css, useTheme } from 'styled-components/native';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
  TextLayoutEventData,
  ViewProps,
  StyleSheet,
  Pressable,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  ScrollView,
  TapGestureHandler,
  State,
  HandlerStateChangeEvent,
  TapGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
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
import { postsActions } from '../../redux/posts';
import { useAppDispatch } from '../../redux/hooks';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const INITIAL_OVERLAY_OPACITY = 0.5;
const INITIAL_HEART_SCALE = 0.3;
const SPRING_SCALE_CONFIG: Animated.SpringAnimationConfig = {
  toValue: 1,
  useNativeDriver: true,
  velocity: 5,
  tension: 100,
  friction: 5,
};

type TPostItemProps = TPost & { style?: ViewProps['style'] };

export const PostItem = memo(function PostItem({
  style,
  ...post
}: TPostItemProps): JSX.Element {
  const {
    id,
    owner,
    createdAt,
    medias,
    caption,
    previewLikes,
    previewComments,
    location,
    viewerHasLiked,
  } = post;
  const dispatch = useAppDispatch();
  const navigation = useNavigation<THomeStackNavigationProps>();
  const theme = useTheme();
  const [captionLines, setCaptionLines] = useState(0);
  const [captionExpanded, setCaptionExpanded] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(viewerHasLiked);
  const heartScale = useMemo(() => new Animated.Value(1), []);
  const [showHeartOverlay, setShowHeartOverlay] = useState(false);
  const doubleTapRef = useRef(null);
  const heartOverlayOpacity = useMemo(
    () => new Animated.Value(INITIAL_OVERLAY_OPACITY),
    [],
  );
  const heartOverlayScale = useMemo(
    () => new Animated.Value(INITIAL_HEART_SCALE),
    [],
  );

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

  const dispatchPostLike = useCallback(
    (flag: boolean) => {
      dispatch(
        postsActions.likePost({
          collection: 'posts',
          flag,
          id,
        }),
      );
    },
    [dispatch, id],
  );

  const handleLike = useCallback(async () => {
    setIsLiked(prevIsLiked => {
      dispatchPostLike(!prevIsLiked);
      heartScale.setValue(INITIAL_HEART_SCALE);
      Animated.spring(heartScale, SPRING_SCALE_CONFIG).start();
      return !prevIsLiked;
    });
  }, [dispatchPostLike, heartScale]);

  const onDoubleTapMedia = useCallback(
    (e: HandlerStateChangeEvent<TapGestureHandlerEventPayload>) => {
      if (e.nativeEvent.state !== State.ACTIVE) return;
      setShowHeartOverlay(true);

      if (!isLiked) {
        setIsLiked(true);
        dispatchPostLike(true);
      }

      heartOverlayOpacity.setValue(INITIAL_OVERLAY_OPACITY);
      heartOverlayScale.setValue(INITIAL_HEART_SCALE);
      Animated.sequence([
        Animated.parallel([
          Animated.timing(heartOverlayOpacity, {
            toValue: 1,
            duration: theme.animation.timingFast,
            useNativeDriver: true,
          }),
          Animated.spring(heartOverlayScale, SPRING_SCALE_CONFIG),
          Animated.spring(heartScale, SPRING_SCALE_CONFIG),
        ]),
        Animated.timing(heartOverlayOpacity, {
          toValue: 0,
          duration: theme.animation.timingFast,
          delay: theme.animation.timingBase,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) {
          setShowHeartOverlay(false);
        }
      });
    },
    [
      heartOverlayOpacity,
      heartOverlayScale,
      heartScale,
      isLiked,
      dispatchPostLike,
      theme.animation,
    ],
  );

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
        {showHeartOverlay ? (
          <HeartOverlayContainer testID="PostItem-HeartOverlay">
            <AnimatedHeartOverlay
              style={{
                transform: [{ scale: heartOverlayScale }],
                opacity: heartOverlayOpacity,
              }}
            >
              <HeartSvg
                color={theme.color.white}
                fill={theme.color.white}
                width={SCREEN_WIDTH / 3}
                height={SCREEN_WIDTH / 3}
              />
            </AnimatedHeartOverlay>
          </HeartOverlayContainer>
        ) : null}
        <TapGestureHandler
          ref={doubleTapRef}
          numberOfTaps={2}
          onHandlerStateChange={onDoubleTapMedia}
        >
          {isMultiImage ? (
            <View>
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
            </View>
          ) : (
            <Image source={{ uri: medias[0].url }} />
          )}
        </TapGestureHandler>
      </ImageContainer>
      <Footer>
        <ActionsRow>
          <Row>
            <HeartContainer>
              <AnimatedPressable
                onPress={handleLike}
                style={{ transform: [{ scale: heartScale }] }}
              >
                <HeartSvg
                  color={isLiked ? theme.color.red : theme.color.black}
                  fill={isLiked ? theme.color.red : 'none'}
                  testID="PostItem-Heart"
                />
              </AnimatedPressable>
            </HeartContainer>
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

const HeartOverlayContainer = styled.View`
  ${StyleSheet.absoluteFill};
  z-index: 2;
`;

const AnimatedHeartOverlay = styled(Animated.View)`
  width: ${SCREEN_WIDTH}px;
  height: ${SCREEN_WIDTH}px;
  justify-content: center;
  align-items: center;
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

const HeartContainer = styled.View`
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
