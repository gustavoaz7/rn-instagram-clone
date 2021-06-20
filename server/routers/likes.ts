import faker from 'faker';
import { Router } from 'express';
import type {
  TPostLikeResponse,
  TPostLikeBody,
} from '../../src/services/likes';
import { database } from '../database';
import { session } from '../session';
import { TLikeDB } from '../types';
import { convertUserToOwner } from '../utils';

export const likesRouter = Router();

type TGetLikesRes = TPostLikeResponse;
likesRouter.post<null, TGetLikesRes, TPostLikeBody>('/', (req, res) => {
  const { collection, id, flag } = req.body;

  if (flag) {
    const currentUser = database.users.get(session.getUsername())!;
    const like: TLikeDB = {
      id: faker.datatype.uuid(),
      associatedId: id,
      createdAt: Date.now(),
      owner: convertUserToOwner(currentUser),
    };

    database[collection].get(id)!.likesIds.push(like.id);
    database.likes.set(like.id, like);
  } else {
    const { likesIds } = database[collection].get(id)!;
    likesIds.splice(likesIds.indexOf(id), 1);
  }

  res.send();
});
