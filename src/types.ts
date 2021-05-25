export type TOwner = {
  id: string;
  profilePicUrl: string;
  username: string;
};

export type TTappableObject = {
  id: string;
  type: 'location' | 'mention' | 'tag';
  text: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
};

export type TPostMedia = {
  id: string;
  url: string;
  owner: TOwner;
  tappableObjects: TTappableObject[];
};

export type TComment = {
  id: string;
  owner: TOwner;
  createdAt: number;
  text: string;
  likedBy: string[];
};

export type TPost = {
  id: string;
  owner: TOwner;
  createdAt: number;
  medias: TPostMedia[];
  caption?: string;
  likedBy: string[];
  comments: TComment[];
  location?: string;
};

export type TUser = {
  id: string;
  username: string;
  profilePicUrl: string;
  followers: string[];
  following: string[];
  email: string;
  phone: string;
  fullName: string;
  website?: string;
  bio?: string;
  gender: 'Female' | 'Male' | 'Custom' | 'Prefer not to say';
  dob: number;
};
