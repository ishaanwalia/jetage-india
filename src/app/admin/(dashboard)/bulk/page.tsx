import { BulkClient } from "./BulkClient";

export const dynamic = "force-dynamic";

export default async function BulkPage({
  searchParams,
}: {
  searchParams: Promise<{ applied?: string; already?: string }>;
}) {
  const { applied, already } = await searchParams;
  return <BulkClient applied={applied} already={already} />;
}
