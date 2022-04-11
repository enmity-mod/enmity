import { Profile, User } from 'enmity-api/common';
import * as Modules from '../utils/modules';

const Users = Modules.common.users;

export async function fetchCurrentUser(): Promise<User> {
  return Users.fetchCurrentUser();
}

export async function fetchProfile(userID: string): Promise<Profile> {
  return Users.fetchProfile(userID);
}

export async function getUser(userID: string): Promise<User> {
  return Users.getUser(userID);
}
