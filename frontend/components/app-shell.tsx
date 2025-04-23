"use client";

import { useEffect } from "react";
import ChatWidget from "./chat-widget";
import { useAuthStore } from "@/app/stores/useAuthStore";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  useEffect(() => {
    const savedUser = sessionStorage.getItem("auth_user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setAuthenticated(parsed);
      } catch (e) {
        console.warn("Failed to restore session in layout", e);
      }
    }
  }, [setAuthenticated]);

  return (
    <>
      {children}
      <ChatWidget />
    </>
  );
}
