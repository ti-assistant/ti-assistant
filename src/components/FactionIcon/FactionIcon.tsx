import Image from "next/image";
import { CSSProperties, useMemo } from "react";
import { SymbolX } from "../../icons/svgs";
import { rem } from "../../util/util";
import SiteLogo from "../SiteLogo/SiteLogo";
import styles from "./FactionIcon.module.scss";

type Size = `${number}%` | number;

interface FactionIconProps {
  factionId?: FactionId | "None";
  size: Size;
}

interface FactionIconCSS extends CSSProperties {
  "--size": string;
}

export default function FactionIcon({ factionId, size }: FactionIconProps) {
  let innerContent = useMemo(() => {
    if (!factionId) {
      return <SiteLogo />;
    }

    if (factionId === "None") {
      return <SymbolX />;
    }

    const adjustedFactionName = factionId.replace("'", "");

    return (
      <Image
        src={`/images/factions/${adjustedFactionName}.webp`}
        alt={`${factionId} Icon`}
        sizes={rem(200)}
        fill
        style={{ objectFit: "contain" }}
        priority
      />
    );
  }, [factionId]);

  const factionIconStyle: FactionIconCSS = {
    "--size": typeof size === "string" ? size : rem(size),
  };
  return (
    <div className={styles.FactionIcon} style={factionIconStyle}>
      {innerContent}
    </div>
  );
}
