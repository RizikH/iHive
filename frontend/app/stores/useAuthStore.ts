import { create } from "zustand";

type User = {
  id: string;
  username: string;
  user_type: string;
  avatar: string;
  bio?: string;
  email?: string;
};

type AuthState = {
  isAuthenticated: boolean;
  currentUser: User;
  setAuthenticated: (user: User | null) => void;
  logout: () => void;
  initializeFromSession: () => void;
  updateCurrentUserBio: (bio: string) => void; // Add this function
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  currentUser: { id: "", username: "", user_type: "", avatar: "", bio: "", email: "" },
  setAuthenticated: (user) => {
    if (user) {
      set({ isAuthenticated: true, currentUser: user });
      sessionStorage.setItem("auth_user", JSON.stringify(user));
    } else {
      set({ isAuthenticated: false, currentUser: { id: "", username: "", user_type: "", avatar: "", bio: "", email: "" } });
      sessionStorage.removeItem("auth_user");
    }
  },
  logout: () => {
    set({ isAuthenticated: false, currentUser: { id: "", username: "", user_type: "", avatar: "", bio: "", email: "" } });
    sessionStorage.removeItem("auth_user");
  },
  initializeFromSession: () => {
    const stored = sessionStorage.getItem("auth_user");
    if (stored) {
      const parsed = JSON.parse(stored);
      set({ isAuthenticated: true, currentUser: parsed });
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