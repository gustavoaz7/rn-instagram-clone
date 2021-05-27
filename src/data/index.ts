import type { TLike, TComment, TPostMedia, TPost } from '../types';

export const generateMockLike = (): TLike => ({
  id: `${Math.random()}`,
  owner: {
    id: `${Math.random()}`,
    profilePicUrl: 'https://avatars.githubusercontent.com/u/28453820?v=4',
    username: 'gustavoaz7',
  },
  createdAt: 1620488304326,
});

export const generateMockComment = (likesQty = 1): TComment => ({
  id: `${Math.random()}`,
  owner: {
    id: `${Math.random()}`,
    profilePicUrl: 'https://cdn.fakercloud.com/avatars/antonyzotov_128.jpg',
    username: 'Vivienne_Doyle',
  },
  createdAt: 1620488304326,
  text: 'Aspernatur quod ea unde repellendus magni nihil sunt.',
  previewLikes: {
    count: likesQty,
    likes: [...Array(likesQty)].map(generateMockLike),
  },
});

export const generateMockMedia = (): TPostMedia => ({
  id: `${Math.random()}`,
  url: 'http://placeimg.com/640/480/cats',
  owner: {
    id: `${Math.random()}`,
    profilePicUrl: 'https://avatars.githubusercontent.com/u/28453820?v=4',
    username: 'gustavoaz7',
  },
  tappableObjects: [],
});

export const generateMockPost = ({
  mediasQty = 1,
  likesQty = 3,
  commentsQty = 1,
} = {}): TPost => ({
  id: `${Math.random()}`,
  owner: {
    id: `${Math.random()}`,
    profilePicUrl: 'https://avatars.githubusercontent.com/u/28453820?v=4',
    username: 'gustavoaz7',
  },
  createdAt: 1620488304326,
  medias: [...Array(mediasQty)].map(generateMockMedia),
  caption:
    'Tempora rerum minima dolor quibusdam blanditiis ea et. Earum iste iure expedita velit laudantium inventore quia qui. Distinctio consectetur accusamus voluptatum hic rem at quas. Incidunt ipsum sed illo molestiae vitae ullam sit consequatur autem. Ut voluptatem nisi. Velit ex dignissimos sed aut.',
  previewLikes: {
    count: likesQty,
    likes: [...Array(likesQty)].map(generateMockLike),
  },
  previewComments: {
    count: commentsQty,
    comments: [...Array(commentsQty)].map(generateMockComment),
  },
  location: 'Daronville',
});
