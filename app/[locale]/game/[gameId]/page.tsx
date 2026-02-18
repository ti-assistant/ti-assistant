import "server-only";
import SelectFactionPage from "./game-page";

export default async function Page({
  params,
}: {
  params: Promise<{ gameId: string }>;
}) {
  return <SelectFactionPage />;
}
