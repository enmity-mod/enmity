import { getModule } from "../utils/modules";

const userModule = getModule(m => m.fetchProfile);

async function fetchCurrentUser() {
  return userModule.fetchCurrentUser();
}

async function fetchProfile(userID: string) {
  return userModule.fetchProfile(userID);
}

async function getUser(userID: string) {
  return userModule.getUser(userID);
}

export {
  fetchCurrentUser,
  fetchProfile,

  getUser
}