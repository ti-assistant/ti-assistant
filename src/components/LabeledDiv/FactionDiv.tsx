import { PropsWithChildren } from "react";
import { useFactionColors } from "../../context/factionDataHooks";
import FactionComponents from "../FactionComponents/FactionComponents";
import LabeledDiv from "./LabeledDiv";

export default function FactionDiv({
  children,
  factionId,
}: PropsWithChildren<{ factionId: FactionId }>) {
  const colors = useFactionColors(factionId);

  return (
    <LabeledDiv
      label={<FactionComponents.Name factionId={factionId} />}
      borderColor={colors.border}
      color={colors.color}
    >
      {children}
    </LabeledDiv>
  );
}
