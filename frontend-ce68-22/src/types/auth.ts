export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UserKey {
  firstName: string;
  lastName: string;
  email: string;
}

export interface AuthState {
  userNow: UserKey | null;
  setUserNow: (user: UserKey) => void;
  clearUser: () => void;
}