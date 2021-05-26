import { TComment } from '../types';

export const generateComment = (): TComment => ({
  id: `${Math.random()}`,
  owner: {
    id: `${Math.random()}`,
    profilePicUrl: 'https://cdn.fakercloud.com/avatars/antonyzotov_128.jpg',
    username: 'Vivienne_Doyle',
  },
  createdAt: 1620488304326,
  text: 'Aspernatur quod ea unde repellendus magni nihil sunt.',
  likedBy: ['Frankie30', 'Patricia24', 'Westley_Ebert49'],
});
