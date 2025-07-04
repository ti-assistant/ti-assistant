import { useIntl } from "react-intl";
import { unitTypeString } from "../../util/strings";
import UnitIcon from "./Icons";
import { rem } from "../../util/util";

export default function UnitType({ type }: { type: UnitType }) {
  const intl = useIntl();
  return unitTypeString(type, intl).toUpperCase();
}

export function UnitTypeWithIcon({
  color = "#eee",
  size = 16,
  type,
}: {
  color?: string;
  size?: number;
  type: UnitType;
}) {
  return (
    <div className="flexRow" style={{ gap: rem(4) }}>
      <UnitType type={type} />
      <UnitIcon type={type} color={color} size={size} />
    </div>
  );
}
