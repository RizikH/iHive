import { Suspense } from "react";
import InvestorClient from "./InvestorClient";

export default function InvestorPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InvestorClient />
    </Suspense>
  );
}
