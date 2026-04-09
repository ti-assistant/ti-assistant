import dynamic from "next/dynamic";
import { CSSProperties, PropsWithChildren, ReactNode } from "react";
import { useOptions } from "../../context/dataHooks";
import { useFactionColors } from "../../context/factionDataHooks";
import { rem } from "../../util/util";
import FactionComponents from "../FactionComponents/FactionComponents";
import LabeledDiv from "../LabeledDiv/LabeledDiv";
import styles from "./FactionCard.module.scss";
import FactionIcon from "../FactionIcon/FactionIcon";
import { useActiveFactionId } from "../../context/gameDataHooks";

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
  factionId: FactionId;
  hideIcon?: boolean;
  rightLabel?: ReactNode;
  opts?: FactionCardOpts;
  style?: CSSProperties;
}

export default function FactionCard({
  children,
  factionId,
  hideIcon = false,
  rightLabel,
  style = {},
  opts = {},
}: PropsWithChildren<FactionCardProps>) {
  const activeFactionId = useActiveFactionId();
  const options = useOptions();
  const colors = useFactionColors(factionId);

  return (
    <LabeledDiv
      label={
        <div
          className="flexRow"
          style={{
            gap: "0.25rem",
            fontFamily:
              activeFactionId === factionId ? "var(--main-font) " : undefined,
          }}
        >
          <FactionIcon factionId={factionId} size={16} />
          <FactionComponents.Name factionId={factionId} />
          <FactionPanel factionId={factionId} options={options} />
        </div>
      }
      rightLabel={rightLabel}
      borderColor={colors.border}
      color={colors.color}
      innerStyle={{ justifyContent: "flex-start", ...style }}
    >
      <div
        className={styles.FactionCard}
        style={{
          fontSize: opts.fontSize ?? undefined,
        }}
      >
        {/* {hideIcon ? null : (
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
              <FactionComponents.Icon factionId={factionId} size="100%" />
            </div>
          </div>
        )} */}
        {children}
      </div>
    </LabeledDiv>
  );
}
