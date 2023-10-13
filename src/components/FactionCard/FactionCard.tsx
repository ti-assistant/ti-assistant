import dynamic from "next/dynamic";
import { CSSProperties, PropsWithChildren, ReactNode, useContext } from "react";
import { Loader } from "../../Loader";
import { OptionContext } from "../../context/Context";
import { getFactionColor, getFactionName } from "../../util/factions";
import FactionIcon from "../FactionIcon/FactionIcon";
import LabeledDiv from "../LabeledDiv/LabeledDiv";
import styles from "./FactionCard.module.scss";

interface FactionCardOpts {
  fontSize?: string;
  iconSize?: string;
}

interface FactionCardProps {
  faction: Faction;
  hideIcon?: boolean;
  rightLabel?: ReactNode;
  onClick?: () => void;
  opts?: FactionCardOpts;
  style?: CSSProperties;
}

const FactionPanel = dynamic(
  () => import("../FactionPanel").then((mod) => mod.FactionPanel),
  {
    loading: () => <Loader />,
  }
);

export default function FactionCard({
  children,
  faction,
  hideIcon = false,
  onClick,
  rightLabel,
  style = {},
  opts = {},
}: PropsWithChildren<FactionCardProps>) {
  const options = useContext(OptionContext);

  return (
    <LabeledDiv
      label={
        // <div className="flexRow" style={{ gap: 0 }}>
        getFactionName(faction)
        // <FactionPanel faction={faction} options={options} />
        // </div>
      }
      rightLabel={rightLabel}
      color={getFactionColor(faction)}
      onClick={onClick}
      style={{ justifyContent: "flex-start", ...style }}
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
