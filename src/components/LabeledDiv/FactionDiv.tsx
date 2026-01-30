import { PropsWithChildren } from "react";
import { useFactionColor } from "../../context/factionDataHooks";
import FactionComponents from "../FactionComponents/FactionComponents";
import LabeledDiv from "./LabeledDiv";

export default function FactionDiv({
  children,
  factionId,
}: PropsWithChildren<{ factionId: FactionId }>) {
  const color = useFactionColor(factionId);

  return (
    <LabeledDiv
      label={<FactionComponents.Name factionId={factionId} />}
      color={color}
    >
      {children}
    </LabeledDiv>
  );
}
