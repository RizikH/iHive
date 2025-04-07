// app/repository/page.tsx
"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// Dynamic import without `suspense: true`
const RepositoryClient = dynamic(() => import("./RepositoryClient"), {
  ssr: false,
});

export default function RepositoryPage() {
  return (
    <Suspense fallback={<div>Loading repository...</div>}>
      <RepositoryClient />
    </Suspense>
  );
}
