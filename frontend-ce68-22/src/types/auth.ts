export interface LoginPayload {
  email: string;
  password: string;
}

export interface UserKey {
  email: string;
  username: string;
}

export interface AuthState {
  userNow: UserKey | null;
  setUserNow: (user: UserKey) => void;
  clearUser: () => void;
}