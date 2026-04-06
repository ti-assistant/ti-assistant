import { PropsWithChildren } from "react";
import { useFactionColors } from "../../context/factionDataHooks";
import FactionComponents from "../FactionComponents/FactionComponents";
import LabeledDiv from "./LabeledDiv";
import FactionIcon from "../FactionIcon/FactionIcon";

export default function FactionDiv({
  children,
  factionId,
}: PropsWithChildren<{ factionId: FactionId }>) {
  const colors = useFactionColors(factionId);

  return (
    <LabeledDiv
      label={
        <div className="flexRow" style={{ gap: "0.25em" }}>
          <FactionIcon factionId={factionId} size={16} />
          <FactionComponents.Name factionId={factionId} />
        </div>
      }
      borderColor={colors.border}
      color={colors.color}
    >
      {children}
    </LabeledDiv>
  );
}
