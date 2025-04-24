import { create } from "zustand";

type User = {
  id: string;
  username: string;
  user_type: string;
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
  currentUser: { id: "", username: "", user_type: "" },
  setAuthenticated: (user) => {
    if (user) {
      set({ isAuthenticated: true, currentUser: user });
      sessionStorage.setItem("auth_user", JSON.stringify(user));
    } else {
      set({ isAuthenticated: false, currentUser: { id: "", username: "", user_type: "" } });
      sessionStorage.removeItem("auth_user");
    }
  },
  logout: () => {
    set({ isAuthenticated: false, currentUser: { id: "", username: "", user_type: "" } });
    sessionStorage.removeItem("auth_user");
  },
  initializeFromSession: () => {
    const stored = sessionStorage.getItem("auth_user");
    if (stored) {
      const parsed = JSON.parse(stored);
      set({ isAuthenticated: true, currentUser: parsed });
    }
  },
}));
