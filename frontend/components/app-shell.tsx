"use client";

import { useEffect } from "react";
import ChatWidget from "./chat-widget";
import { useAuthStore } from "@/app/stores/useAuthStore";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const initializeFromSession = useAuthStore((state) => state.initializeFromSession);

  useEffect(() => {
    initializeFromSession();
  }, [initializeFromSession]);

  return (
    <>
      {children}
      <ChatWidget />
    </>
  );
}
