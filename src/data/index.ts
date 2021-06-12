import type {
  TLike,
  TComment,
  TPostMedia,
  TPost,
  TOwner,
  TStory,
  TStoryMedia,
} from '../types';

export const generateMockOwner = (): TOwner => ({
  id: `${Math.random()}`,
  profilePicUrl: 'https://avatars.githubusercontent.com/u/28453820?v=4',
  username: 'gustavoaz7',
});

export const generateMockLike = (): TLike => ({
  id: `${Math.random()}`,
  owner: generateMockOwner(),
  createdAt: 1620488304326,
});

export const generateMockComment = (likesQty = 1): TComment => ({
  id: `${Math.random()}`,
  owner: generateMockOwner(),
  createdAt: 1620488304326,
  text: 'Aspernatur quod ea unde repellendus magni nihil sunt.',
  previewLikes: {
    count: likesQty,
    likes: [...Array(likesQty)].map(generateMockLike),
  },
});

export const generateMockPostMedia = ({ index = 0 } = {}): TPostMedia => ({
  id: `${Math.random()}`,
  url: `http://placeimg.com/640/480/cats?${index}`,
  owner: generateMockOwner(),
  tappableObjects: [],
});

export const generateMockPost = ({
  mediasQty = 1,
  likesQty = 3,
  commentsQty = 1,
} = {}): TPost => ({
  id: `${Math.random()}`,
  owner: generateMockOwner(),
  createdAt: 1620488304326,
  medias: [...Array(mediasQty)].map(generateMockPostMedia),
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

export const generateMockStoryMedia = ({
  viewersQty = 0,
  index = 0,
} = {}): TStoryMedia => ({
  id: `${Math.random()}`,
  url: `http://placeimg.com/640/480/cats?${index}`,
  owner: generateMockOwner(),
  tappableObjects: [],
  previewViewers: {
    count: viewersQty,
    viewers: [...Array(viewersQty)].map(generateMockOwner),
  },
  takenAt: 1620488304326,
  expiresAt: 1620488304326 + 3600 * 24,
});

export const generateMockStory = ({
  mediasQty = 3,
  viewersQty = 0,
} = {}): TStory => ({
  id: `${Math.random()}`,
  owner: generateMockOwner(),
  expiresAt: 0,
  latestMediaAt: 0,
  seenAt: 0,
  medias: [...Array(mediasQty)].map((_, index) =>
    generateMockStoryMedia({ viewersQty, index }),
  ),
});
