import Image from "next/image";
import Logo from "../../../public/images/android-chrome-512x512.png";
import { rem } from "../../util/util";
import styles from "./SiteLogo.module.scss";

export default function SiteLogo() {
  return (
    <div className={styles.Logo}>
      <Image
        src={Logo}
        alt=""
        sizes={rem(32)}
        fill
        unoptimized
        style={{ objectFit: "contain" }}
        priority
      />
    </div>
  );
}
