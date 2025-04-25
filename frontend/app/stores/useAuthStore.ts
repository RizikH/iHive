import { create } from "zustand";
import { fetcher } from "../utils/fetcher";

type User = {
  bio: string | number | readonly string[] | undefined;
  id: string;
  username: string;
  user_type: string;
  avatar: string;
  email: string;
  created_at: string;
};

type AuthState = {
  isAuthenticated: boolean;
  currentUser: User;
  setAuthenticated: (user: User | null) => void;
  logout: () => void;
  initializeFromSession: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  currentUser: { id: "", username: "", user_type: "", avatar: "", email: "", created_at: "", bio: "" },
  setAuthenticated: (user) => {
    if (user) {
      set({ isAuthenticated: true, currentUser: user });
      sessionStorage.setItem("auth_user", JSON.stringify(user));
    } else {
      set({ isAuthenticated: false, currentUser: { id: "", username: "", user_type: "", avatar: "", email: "", created_at: "", bio: "" } });
      sessionStorage.removeItem("auth_user");
    }
  },
  logout: () => {
    set({ isAuthenticated: false, currentUser: { id: "", username: "", user_type: "", avatar: "", email: "", created_at: "", bio: "" } });
    sessionStorage.removeItem("auth_user");
  },
  initializeFromSession: async () => {
    const stored = sessionStorage.getItem("auth_user");
    if (stored) {
      const parsed = JSON.parse(stored);
      const user = await fetcher(`/users/${parsed.id}`, "GET");
      set({ isAuthenticated: true, currentUser: user });
    }
  },
}));