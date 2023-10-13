import Image from "next/image";
import { CSSProperties } from "react";
import Logo from "../../../public/images/android-chrome-512x512.png";
import { responsivePixels } from "../../util/util";
import styles from "./ResponsiveLogo.module.scss";

type Size = `${number}%` | number;

interface ResponsiveLogoCSS extends CSSProperties {
  "--size": string;
}

export default function ResponsiveLogo({ size }: { size: Size }) {
  const style: ResponsiveLogoCSS = {
    "--size": typeof size === "string" ? size : responsivePixels(size),
  };

  return (
    <div className={styles.ResponsiveLogo} style={style}>
      <Image src={Logo} alt="" layout="fill" objectFit="contain" />
    </div>
  );
}
