import { MapButton } from "../../src/components/QRCode/QRCodeButton";
import QRCodeButtonWrapper from "../../src/components/QRCode/QRCodeButtonWrapper";

export default function NavBarClientButtons() {
  return (
    <>
      <QRCodeButtonWrapper />
      <MapButton />
    </>
  );
}
