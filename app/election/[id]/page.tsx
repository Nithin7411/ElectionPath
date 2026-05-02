import { getAllElections } from "@/lib/data-service";
import ElectionDetailClient from "./ElectionDetailClient";

export async function generateStaticParams() {
  const elections = await getAllElections();
  return elections.map((election: any) => ({
    id: election.id,
  }));
}

export default function ElectionDetailPage() {
  return <ElectionDetailClient />;
}
