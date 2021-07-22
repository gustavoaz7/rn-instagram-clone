import { Router } from 'express';
import { database } from '../database';
import { session } from '../session';
import { TStory } from '../types';
import type { TStoriesResponse } from '../../src/services/stories';
import { transformStory } from '../transformations';

export const storiesRouter = Router();

storiesRouter.get<null, TStoriesResponse>('/', (req, res) => {
  const currentUser = database.users.get(session.getUsername())!;

  const stories = currentUser.following.map<TStory>(username => {
    const user = database.users.get(username)!;
    const storyMedias = user.storiesIds.map(
      storyId => database.stories.get(storyId)!,
    );

    return transformStory(storyMedias, user);
  });

  return res.send(stories);
});
