import { TPost } from '../types';
import { generatePostMedia } from './media';

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
  comments: [
    {
      id: `${Math.random()}`,
      owner: {
        id: `${Math.random()}`,
        profilePicUrl: 'https://cdn.fakercloud.com/avatars/antonyzotov_128.jpg',
        username: 'Vivienne_Doyle',
      },
      createdAt: 1620488304326,
      text: 'Aspernatur quod ea unde repellendus magni nihil sunt.',
      likedBy: ['Frankie30', 'Patricia24', 'Westley_Ebert49'],
    },
  ],
  location: 'Daronville',
});
