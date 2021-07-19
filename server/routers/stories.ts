import { Router } from 'express';
import { database } from '../database';
import { session } from '../session';
import { TStory } from '../types';
import { convertUserToOwner } from '../utils';
import type { TStoriesResponse } from '../../src/services/stories';

export const storiesRouter = Router();

storiesRouter.get<null, TStoriesResponse>('/', (req, res) => {
  const currentUser = database.users.get(session.getUsername())!;

  const stories = currentUser.following.map<TStory>(username => {
    const user = database.users.get(username)!;
    const storyMedias = user.storiesIds
      .map(storyId => database.stories.get(storyId)!)
      .filter(story => story.expiresAt > Date.now())
      .sort((a, b) => a.takenAt - b.takenAt);

    return {
      id: username,
      owner: convertUserToOwner(user),
      medias: storyMedias,
      expiresAt: storyMedias[storyMedias.length - 1].expiresAt,
      latestMediaAt: storyMedias[storyMedias.length - 1].takenAt,
    };
  });

  return res.send(stories);
});
