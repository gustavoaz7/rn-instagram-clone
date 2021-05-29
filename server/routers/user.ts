import { Router } from 'express';
import faker from 'faker';
import { database } from '../database';
import { session } from '../session';
import {
  generateComment,
  generateLike,
  generatePost,
  generateUser,
} from '../utils';

export const userRouter = Router();

userRouter.post('/login', (req, res) => {
  const { username, profilePicUrl } = req.body;
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
          Math.random() < 0.5 ? 0 : faker.datatype.number({ min: 1, max: 50 }),
        ),
      ]
        .map(() => generateComment({ associatedId: post.id }))
        .sort((a, b) => b.createdAt - a.createdAt);

      comments.forEach(comment => database.comments.set(comment.id, comment));
      post.commentsIds.push(...comments.map(comment => comment.id));

      const likes = [...Array(faker.datatype.number(20))]
        .map(() => generateLike({ associatedId: post.id }))
        .sort((a, b) => b.createdAt - a.createdAt);

      likes.forEach(like => database.likes.set(like.id, like));
      post.likesIds.push(...likes.map(like => like.id));

      database.posts.set(post.id, post);
    });
  });

  res.send(currentUser);
});
