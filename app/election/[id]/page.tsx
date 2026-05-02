import { LOCAL_ELECTIONS } from "@/lib/local-elections";
import ElectionDetailClient from "./ElectionDetailClient";

export async function generateStaticParams() {
  return LOCAL_ELECTIONS.map((election) => ({
    id: election.id,
  }));
}

export default function ElectionDetailPage() {
  return <ElectionDetailClient />;
}
