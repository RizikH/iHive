import { fetcher } from "./fetcher";

/**
 * Checks if the user is authenticated by calling /users/me
 * @returns the user object if authenticated, otherwise null
 */
export const isAuthenticated = async () => {
  try {
    const user = await fetcher("/users/me");
    if (user?.id) {
      return user;
    }
    return null;
  } catch (err) {
    return null;
  }
};