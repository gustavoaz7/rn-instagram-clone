import { TPost } from '../types';
import { generatePostMedia } from './media';
import { generateComment } from './comment';

export const createMockPost = (): TPost => ({
  id: `${Math.random()}`,
  owner: {
    id: `${Math.random()}`,
    profilePicUrl: 'https://avatars.githubusercontent.com/u/28453820?v=4',
    username: 'gustavoaz7',
  },
  createdAt: 1620488304326,
  medias: [generatePostMedia()],
  caption:
    'Tempora rerum minima dolor quibusdam blanditiis ea et. Earum iste iure expedita velit laudantium inventore quia qui. Distinctio consectetur accusamus voluptatum hic rem at quas. Incidunt ipsum sed illo molestiae vitae ullam sit consequatur autem. Ut voluptatem nisi. Velit ex dignissimos sed aut.',
  likedBy: ['Tito.Zieme', 'Cleo.Runte69', 'Laverna.Emmerich24'],
  commentsCount: 2,
  comments: [generateComment(), generateComment()],
  location: 'Daronville',
});
