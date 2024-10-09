import Image from "next/image";
import { CSSProperties } from "react";
import Logo from "../../../public/images/android-chrome-512x512.png";
import styles from "./ResponsiveLogo.module.scss";
import { rem } from "../../util/util";

type Size = `${number}%` | number;

interface ResponsiveLogoCSS extends CSSProperties {
  "--size": string;
}

export default function ResponsiveLogo({ size }: { size: Size }) {
  const style: ResponsiveLogoCSS = {
    "--size": typeof size === "string" ? size : rem(size),
  };

  return (
    <div className={styles.ResponsiveLogo} style={style}>
      <Image
        src={Logo}
        alt=""
        sizes={rem(32)}
        fill
        style={{ objectFit: "contain" }}
        priority
      />
    </div>
  );
}
