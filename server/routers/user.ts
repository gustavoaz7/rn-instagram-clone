import { Router } from 'express';
import { faker } from '@faker-js/faker';
import type {
  TFakeLoginResponse,
  TFakeLoginBody,
  TProfileResponse,
} from '../../src/services/user';
import { database } from '../database';
import { session } from '../session';
import { transformStory } from '../transformations';
import type { TStoryMediaDB } from '../types';
import {
  generateComment,
  generateLike,
  generatePost,
  generateStory,
  generateUser,
} from '../utils';

export const userRouter = Router();

userRouter.post<null, TFakeLoginResponse, TFakeLoginBody>(
  '/login',
  (req, res) => {
    const { username, fullName, profilePicUrl } = req.body;
    // Only configure when database is empty (on 1st request)
    if (database.users.size) {
      const user = database.users.get(username)!;
      res.send(user);
      return;
    }

    const following = [
      ...Array(faker.datatype.number({ min: 40, max: 60 })),
    ].map(() => faker.internet.userName());
    const followers = [
      ...Array(faker.datatype.number({ min: 40, max: 60 })),
    ].map(() => faker.internet.userName());
    const currentUser = generateUser({
      username,
      fullName,
      profilePicUrl,
      following,
      followers,
    });
    session.setUsername(currentUser.username);

    const users = [...new Set([...following, ...followers])].map(user =>
      generateUser({ username: user }),
    );

    [currentUser, ...users].forEach(user =>
      database.users.set(user.username, user),
    );

    [currentUser, ...users].forEach(user => {
      const posts = [...Array(20)].map(() => generatePost(user));
      posts.forEach(post => {
        database.users.get(user.username)!.postsIds.push(post.id);

        const comments = [
          ...Array(
            // 50% -> has comments
            Math.random() < 0.5
              ? 0
              : faker.datatype.number({ min: 1, max: 50 }),
          ),
        ].map(() => generateComment({ associatedId: post.id }));

        comments.forEach(comment => database.comments.set(comment.id, comment));
        post.commentsIds.push(...comments.map(comment => comment.id));

        const likes = [...Array(faker.datatype.number(20))].map(() =>
          generateLike({ associatedId: post.id }),
        );

        likes.forEach(like => database.likes.set(like.id, like));
        post.likesIds.push(...likes.map(like => like.id));

        database.posts.set(post.id, post);
      });

      if (user === currentUser) return;
      const stories = [...Array(10)].map(() => generateStory(user));
      stories.forEach(story => {
        database.users.get(user.username)!.storiesIds.push(story.id);
        database.stories.set(story.id, story);
      });
    });

    res.send(currentUser);
  },
);

type TUserGetParams = { username: string };
type TUserGetRes = TProfileResponse;
userRouter.get<TUserGetParams, TUserGetRes>(
  '/:username/profile',
  (req, res) => {
    const { username } = req.params;
    const user = database.users.get(username)!;
    // TODO populate user in DB if it does not exist
    const loggedUsername = session.getUsername();
    const loggedUser = database.users.get(loggedUsername)!;

    const userStoryMedias: TStoryMediaDB[] = [];
    database.stories.forEach(story => {
      if (story.owner.username === username) {
        userStoryMedias.push(story);
      }
    });

    const profile: TProfileResponse = {
      username: user.username,
      fullName: user.fullName,
      bio: user.bio,
      profilePicUrl: user.profilePicUrl,
      postsCount: user.postsIds.length,
      followCount: user.following.length,
      followedByCount: user.followers.length,
      followedByViewer: loggedUser.following.includes(username),
      followsViewer: user.following.includes(loggedUsername),
      ...(userStoryMedias.length && {
        story: transformStory(userStoryMedias, user),
      }),
    };

    if (username !== loggedUsername) {
      const mutualUsernames = loggedUser.followers.filter(follower =>
        user.followers.includes(follower),
      );
      profile.mutualFollowedBy = {
        count: mutualUsernames.length,
        previewUsernames: mutualUsernames.slice(0, 3),
      };
    }

    res.send(profile);
  },
);
