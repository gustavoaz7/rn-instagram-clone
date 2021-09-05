import React from 'react';
import { FlatList, Image } from 'react-native';
import { render } from '@testing-library/react-native';
import { GalleryGrid, TGalleryGridProps } from './GalleryGrid';
import { Providers } from '../../Providers';
import { SCREEN_WIDTH } from '../../utils/dimensions';
import { generateMockPost } from '../../data';
import LayersSvg from '../../../assets/svg/layers.svg';

describe('components - GalleryGrid', () => {
  const options = { wrapper: Providers };
  const defaultColumns = 3;
  const defaultGap = 2;
  const props: TGalleryGridProps = {
    posts: [...Array(4)].map(generateMockPost),
  };

  it('renders', () => {
    render(<GalleryGrid {...props} />, options);
  });

  it(`renders ${defaultColumns} columns with ${defaultGap} gap by default`, () => {
    const { UNSAFE_getByType, getAllByTestId } = render(
      <GalleryGrid {...props} />,
      options,
    );

    expect(UNSAFE_getByType(FlatList).props).toMatchObject({
      numColumns: defaultColumns,
      columnWrapperStyle: { paddingTop: defaultGap },
    });
    expect(getAllByTestId('GaleryGridItem')[0]).toHaveStyle({
      width:
        (SCREEN_WIDTH - defaultGap * (defaultColumns - 1)) / defaultColumns,
    });
  });

  it(`renders custom columns and gap`, () => {
    const columns = 4;
    const gap = 3;
    const { UNSAFE_getByType, getAllByTestId } = render(
      <GalleryGrid {...props} columns={columns} gap={gap} />,
      options,
    );

    expect(UNSAFE_getByType(FlatList).props).toMatchObject({
      numColumns: columns,
      columnWrapperStyle: { paddingTop: gap },
    });
    expect(getAllByTestId('GaleryGridItem')[0]).toHaveStyle({
      width: (SCREEN_WIDTH - gap * (columns - 1)) / columns,
    });
  });

  it('renders first media image', () => {
    const { UNSAFE_getAllByType } = render(<GalleryGrid {...props} />, options);

    UNSAFE_getAllByType(Image).forEach((image, i) => {
      expect(image.props.source.uri).toEqual(props.posts[i].medias[0].url);
    });
  });

  describe('when post has multiple medias ', () => {
    it('renders layers icon', () => {
      const posts = [generateMockPost({ mediasQty: 2 })];
      const { UNSAFE_getByType } = render(
        <GalleryGrid posts={posts} />,
        options,
      );

      expect(UNSAFE_getByType(LayersSvg)).toBeTruthy();
    });
  });

  describe('when post has a single media ', () => {
    it('doe snot render layers icon', () => {
      const posts = [generateMockPost({ mediasQty: 1 })];
      const { UNSAFE_queryByType } = render(
        <GalleryGrid posts={posts} />,
        options,
      );

      expect(UNSAFE_queryByType(LayersSvg)).toBeFalsy();
    });
  });
});
