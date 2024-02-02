import FactionPage from "./faction-page";

export default async function Page({
  params: { factionId },
}: {
  params: { factionId: FactionId };
}) {
  return <FactionPage factionId={decodeURIComponent(factionId) as FactionId} />;
}
