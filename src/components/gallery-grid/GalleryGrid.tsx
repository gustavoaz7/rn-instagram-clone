import React, { memo, useCallback, useRef } from 'react';
import { FlatList, ListRenderItem, StyleProp, ViewStyle } from 'react-native';
import styled from 'styled-components/native';
import { TPost } from '../../types';
import { SCREEN_WIDTH } from '../../utils/dimensions';
import LayersSvg from '../../../assets/svg/layers.svg';

export type TGalleryGridProps = {
  posts: TPost[];
  columns?: number;
  gap?: number;
};

export function GalleryGrid({
  posts,
  columns = 3,
  gap = 2,
}: TGalleryGridProps): JSX.Element {
  const contentContainerStyle = useRef<StyleProp<ViewStyle>>({
    width: SCREEN_WIDTH,
  }).current;
  const columnWrapperStyle = useRef<StyleProp<ViewStyle>>({
    paddingTop: gap,
    justifyContent: 'space-between',
  }).current;

  const renderItem = useCallback<ListRenderItem<TPost>>(
    ({ item: post }) => (
      <GalleryGrid.Item key={post.id} post={post} columns={columns} gap={gap} />
    ),
    [columns, gap],
  );

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      numColumns={columns}
      columnWrapperStyle={columnWrapperStyle}
      contentContainerStyle={contentContainerStyle}
    />
  );
}

type TGaleryGridItemProps = {
  post: TPost;
  columns: number;
  gap: number;
};
GalleryGrid.Item = memo(
  ({ post, columns, gap }: TGaleryGridItemProps): JSX.Element => {
    const handlePress = useCallback(() => {
      // TODO - navigate to post detail screen
    }, []);
    const handleLongPress = useCallback(() => {
      // TODO - open simple post card
    }, []);

    return (
      <ImageContainer
        testID="GaleryGridItem"
        columns={columns}
        gap={gap}
        onPress={handlePress}
        onLongPress={handleLongPress}
      >
        <PostImage source={{ uri: post.medias[0].url }} />
        {post.medias.length > 1 ? <LayersIcon /> : null}
      </ImageContainer>
    );
  },
);

const ImageContainer = styled.Pressable<{ columns: number; gap: number }>`
  aspect-ratio: 1;
  width: ${({ columns, gap }) =>
    (SCREEN_WIDTH - gap * (columns - 1)) / columns}px;
  position: relative;
`;

const PostImage = styled.Image.attrs(() => ({
  resizeMode: 'cover',
}))`
  flex: 1;
`;

const LayersIcon = styled(LayersSvg).attrs(() => ({
  width: 16,
  height: 16,
}))`
  position: absolute;
  right: ${({ theme }) => theme.spacing.s};
  top: ${({ theme }) => theme.spacing.s};
  color: white;
  opacity: 0.9;
`;
