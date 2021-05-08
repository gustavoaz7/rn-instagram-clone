import { Router } from 'express';
import faker from 'faker';
import { database } from '../database';
import { generatePost, generateUser } from '../utils';

export const configureRouter = Router();

configureRouter.post('/', (req, res) => {
  const { username, profilePicUrl } = req.body;
  // Only configure when database is empty (on 1st request)
  if (database.users.length) {
    const user = database.users.find(u => u.username === username);
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

  const users = [...new Set([...following, ...followers])].map(user =>
    generateUser({ username: user }),
  );

  database.users.push(...[currentUser, ...users]);

  [currentUser, ...users].forEach(user => {
    database.posts.push(...[...Array(20)].map(() => generatePost(user)));
  });

  res.send(currentUser);
});
