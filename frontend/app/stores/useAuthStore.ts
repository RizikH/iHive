import { create } from "zustand";
import { fetcher } from "../utils/fetcher";

type User = {
  bio: string;
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
  updateCurrentUserBio: (bio: string) => void; // ⬅️ add this
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
      const response = await fetcher(`/users/${parsed.id}`, "GET");
      if (response.ok && response.data) {
        const user: User = response.data;
        set({ isAuthenticated: true, currentUser: user });
      } else {
        set({ isAuthenticated: false, currentUser: { id: "", username: "", user_type: "", avatar: "", email: "", created_at: "", bio: "" } });
      }
    }
  },

  updateCurrentUserBio: (bio) => {
    set((state) => ({
      currentUser: {
        ...state.currentUser,
        bio,
      },
    }));
    const stored = sessionStorage.getItem("auth_user");
    if (stored) {
      const updatedUser = { ...JSON.parse(stored), bio };
      sessionStorage.setItem("auth_user", JSON.stringify(updatedUser));
    }
  },
}));
