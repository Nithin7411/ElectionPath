import { LOCAL_ELECTIONS } from "@/lib/local-elections";
import React from "react";

export function generateStaticParams() {
  return LOCAL_ELECTIONS.map((election) => ({
    id: election.id,
  }));
}

export default function ElectionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
