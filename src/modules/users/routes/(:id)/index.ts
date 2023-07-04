import { combined as usersFindOneC } from './get';
import { combined as usersUpdateC } from './patch';
import { combined as usersDeleteC } from './delete';

export const usersFindOne = usersFindOneC;
export const usersUpdate = usersUpdateC;
export const usersDelete = usersDeleteC;
