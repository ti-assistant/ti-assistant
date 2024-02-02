import QRCode from "qrcode";
import "server-only";
import SelectFactionPage from "./game-page";

export default async function Page({
  params: { gameId },
}: {
  params: { gameId: string };
}) {
  return <SelectFactionPage />;
}
