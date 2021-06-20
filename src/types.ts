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

export type TLike = {
  id: string;
  owner: TOwner;
  createdAt: number;
};

export type TPreviewLikes = {
  count: number;
  likes: TLike[];
};
export type TComment = {
  id: string;
  owner: TOwner;
  createdAt: number;
  text: string;
  previewLikes: TPreviewLikes;
};

export type TPreviewComments = {
  count: number;
  comments: TComment[];
};

export type TPost = {
  id: string;
  owner: TOwner;
  createdAt: number;
  medias: TPostMedia[];
  caption?: string;
  previewLikes: TPreviewLikes;
  previewComments: TPreviewComments;
  location?: string;
  viewerHasLiked: boolean;
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

export type TPreviewViewers = {
  count: number;
  viewers: TOwner[];
};

export type TStoryMedia = {
  id: string;
  url: string;
  owner: TOwner;
  tappableObjects: TTappableObject[];
  previewViewers: TPreviewViewers;
  takenAt: number;
  expiresAt: number;
};

export type TStory = {
  id: string;
  owner: TOwner;
  medias: TStoryMedia[];
  expiresAt: number;
  latestMediaAt: number;
  seenAt?: number;
};
