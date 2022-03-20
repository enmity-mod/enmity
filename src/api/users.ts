import { Profile, User } from 'enmity-api/common';
import { getModule } from '../utils/modules';

const userModule = getModule(m => m.fetchProfile);

export async function fetchCurrentUser(): Promise<User> {
  return userModule.fetchCurrentUser();
}

export async function fetchProfile(userID: string): Promise<Profile> {
  return userModule.fetchProfile(userID);
}

export async function getUser(userID: string): Promise<User> {
  return userModule.getUser(userID);
}
