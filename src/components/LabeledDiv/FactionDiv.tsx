import { PropsWithChildren } from "react";
import {
  useFactionColor,
  useFactionDisplayName,
} from "../../context/factionDataHooks";
import LabeledDiv from "./LabeledDiv";

export default function FactionDiv({
  children,
  factionId,
}: PropsWithChildren<{ factionId: FactionId }>) {
  const name = useFactionDisplayName(factionId);
  const color = useFactionColor(factionId);

  return (
    <LabeledDiv label={name} color={color}>
      {children}
    </LabeledDiv>
  );
}
