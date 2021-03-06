import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import type {
  TUserDB,
  TPostDB,
  TPostMedia,
  TCommentDB,
  TTappableObject,
  TOwner,
  TLikeDB,
  TStoryMediaDB,
} from './types';

// ----- USER -----

const GENDERS: TUserDB['gender'][] = [
  'Female',
  'Male',
  'Custom',
  'Prefer not to say',
];

export const generateUser = (partialUser?: Partial<TUserDB>): TUserDB => {
  const card = faker.helpers.contextualCard();

  return {
    id: uuidv4(),
    username: card.username,
    profilePicUrl: card.avatar,
    followers: [...Array(20)].map(() => faker.internet.userName()),
    following: [...Array(20)].map(() => faker.internet.userName()),
    email: card.email,
    phone: card.phone,
    fullName: card.name,
    // 20% -> has website
    ...(Math.random() < 0.2 && {
      website: card.website,
    }),
    // 50% -> has bio
    ...(Math.random() < 0.5 && {
      // 50-50 bio long vs short
      bio: Math.random() < 0.5 ? faker.lorem.text() : faker.lorem.words(5),
    }),
    gender: faker.random.arrayElement(GENDERS),
    dob: card.dob.getTime(),
    postsIds: [],
    storiesIds: [],
    ...partialUser,
  };
};

// ----- LIKE -----

export const generateLike = (partialLike?: Partial<TLikeDB>): TLikeDB => ({
  associatedId: uuidv4(),
  id: uuidv4(),
  createdAt: faker.date.recent(180).getTime(),
  owner: generateOwner(),
  ...partialLike,
});

// ----- POST -----

export const generateOwner = (partialOwner?: Partial<TOwner>): TOwner => ({
  id: uuidv4(),
  profilePicUrl: faker.internet.avatar(),
  username: faker.internet.userName(),
  ...partialOwner,
});

export const generateComment = (
  partialComment?: Partial<TCommentDB>,
): TCommentDB => ({
  associatedId: uuidv4(),
  id: uuidv4(),
  owner: generateOwner(),
  // Disclaimer: might cause a comment to be more recent than
  // the post itself.
  createdAt: faker.date.recent(180).getTime(),
  text: faker.lorem.sentence(),
  likesIds: [],
  viewerHasLiked: false,
  ...partialComment,
});

const TAPPABLE_OBJECT_TYPES: TTappableObject['type'][] = [
  'location',
  'mention',
  'tag',
];

const TAPPABLE_OBJECT_TEXT_GENERATOR_MAP: Record<
  TTappableObject['type'],
  () => string
> = {
  location: faker.address.city,
  mention: () => `#${faker.internet.userName()}`,
  tag: faker.internet.userName,
};

export const generateTappableObject = (
  type?: TTappableObject['type'],
): TTappableObject => {
  const actualType = type ?? faker.random.arrayElement(TAPPABLE_OBJECT_TYPES);
  const text = TAPPABLE_OBJECT_TEXT_GENERATOR_MAP[actualType]();

  return {
    id: uuidv4(),
    type: actualType,
    text,
    // x only goes up to 70% to avoid content overflow
    x: faker.datatype.number({ min: 0, max: 0.7, precision: 0.01 }),
    // y only goes up to 80% to avoid content overflow
    y: faker.datatype.number({ min: 0, max: 0.8, precision: 0.01 }),
    scale: faker.datatype.number({ min: 0.5, max: 1.5, precision: 0.1 }),
    // rotates up to 90deg both clock and counter-clockwise
    rotation: faker.datatype.number({ min: 270, max: 450 }),
  };
};

export const generateMedia = (owner: TOwner): TPostMedia => ({
  id: uuidv4(),
  url: faker.random.image(),
  owner,
  // 80% -> no tappable object
  tappableObjects: [
    ...Array(
      Math.random() < 0.8 ? 0 : faker.datatype.number({ min: 1, max: 3 }),
    ),
  ].map(generateTappableObject),
});

export const generatePost = (
  user: TUserDB,
  partialPost?: Partial<TPostDB>,
): TPostDB => {
  const owner = convertUserToOwner(user);

  return {
    id: uuidv4(),
    owner,
    createdAt: faker.date.recent(180).getTime(),
    // 70% -> single image item
    medias: [
      ...Array(
        Math.random() < 0.7 ? 1 : faker.datatype.number({ min: 2, max: 5 }),
      ),
    ].map(() => generateMedia(owner)),
    // 30% -> no captiopn
    ...(Math.random() < 0.7 && {
      // 50-50 caption long vs short
      caption:
        Math.random() < 0.5 ? faker.lorem.paragraph() : faker.lorem.words(5),
    }),
    // 20% -> has location
    ...(Math.random() < 0.2 && { location: faker.address.city() }),
    viewerHasLiked: false,
    commentsIds: [],
    likesIds: [],
    ...partialPost,
  };
};

export const generateStory = (
  user: TUserDB,
  partialStory?: Partial<TStoryMediaDB>,
): TStoryMediaDB => {
  const owner = convertUserToOwner(user);

  const takenAt = faker.date.recent(2).getTime();

  return {
    id: uuidv4(),
    owner,
    // Type definition seems to be outdated
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    url: faker.image.image(1080, 1920),
    takenAt,
    expiresAt: takenAt + 3600 * 24 * 1000,
    // 80% -> no tappable object
    tappableObjects: [
      ...Array(
        Math.random() < 0.8 ? 0 : faker.datatype.number({ min: 1, max: 3 }),
      ),
    ].map(generateTappableObject),
    previewViewers: {
      count: 0,
      viewers: [],
    },
    viewersIds: [],
    ...partialStory,
  };
};

// ----- HELPERS -----

export const convertUserToOwner = (user: TUserDB): TOwner => ({
  id: user.id,
  profilePicUrl: user.profilePicUrl,
  username: user.username,
});

export const sortByCreatedAt = <T extends { createdAt: number }>(a: T, b: T) =>
  b.createdAt - a.createdAt;
