import FactionPage from "./faction-page";

export default async function Page({
  params,
}: {
  params: Promise<{ factionId: FactionId }>;
}) {
  const { factionId } = await params;
  return <FactionPage factionId={decodeURIComponent(factionId) as FactionId} />;
}
