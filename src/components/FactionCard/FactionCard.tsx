import dynamic from "next/dynamic";
import { CSSProperties, PropsWithChildren, ReactNode } from "react";
import { useOptions } from "../../context/dataHooks";
import { getFactionColor, getFactionName } from "../../util/factions";
import { rem } from "../../util/util";
import FactionIcon from "../FactionIcon/FactionIcon";
import LabeledDiv from "../LabeledDiv/LabeledDiv";
import styles from "./FactionCard.module.scss";

const FactionPanel = dynamic(() => import("../FactionPanel"), {
  loading: () => (
    <div
      className="popupIcon"
      style={{
        fontSize: rem(16),
      }}
    >
      &#x24D8;
    </div>
  ),
  ssr: false,
});

interface FactionCardOpts {
  fontSize?: string;
  iconSize?: string;
}

interface FactionCardProps {
  faction: Faction;
  hideIcon?: boolean;
  rightLabel?: ReactNode;
  opts?: FactionCardOpts;
  style?: CSSProperties;
  viewOnly?: boolean;
}

export default function FactionCard({
  children,
  faction,
  hideIcon = false,
  rightLabel,
  style = {},
  opts = {},
  viewOnly,
}: PropsWithChildren<FactionCardProps>) {
  const options = useOptions();

  return (
    <LabeledDiv
      label={
        <div className="flexRow" style={{ gap: 0 }}>
          {getFactionName(faction)}
          <FactionPanel factionId={faction.id} options={options} />
        </div>
      }
      rightLabel={rightLabel}
      color={getFactionColor(faction)}
      innerStyle={{ justifyContent: "flex-start", ...style }}
    >
      <div
        className={styles.FactionCard}
        style={{
          fontSize: opts.fontSize ?? undefined,
        }}
      >
        {hideIcon ? null : (
          <div
            className="flexRow"
            style={{
              zIndex: -2,
              position: "absolute",
              width: "100%",
              height: "100%",
            }}
          >
            <div
              className="flexRow"
              style={{
                zIndex: -1,
                opacity: "40%",
                position: "absolute",
                top: 0,
                width: opts.iconSize ? opts.iconSize : "100%",
                height: opts.iconSize ? opts.iconSize : "100%",
                userSelect: "none",
              }}
            >
              <FactionIcon factionId={faction.id} size="100%" />
            </div>
          </div>
        )}
        {children}
      </div>
    </LabeledDiv>
  );
}
