"use client";

import { Suspense } from "react";
import RepositorySettingsClient from "./RepositorySettingsClient";

export default function RepositorySettingsPage() {
  return (
    <Suspense fallback={<div>Loading settings...</div>}>
      <RepositorySettingsClient />
    </Suspense>
  );
}
