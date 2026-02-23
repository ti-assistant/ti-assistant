import Sidebars from "../../../../src/components/Sidebars/Sidebars";
import SiteLogo from "../../../../src/components/SiteLogo/SiteLogo";
import styles from "../../root.module.scss";

export default function GameLoader({}) {
  return (
    <>
      <Sidebars left="TI ASSISTANT" right="TI ASSISTANT" />
      <div className={styles.Loader}>
        <div className={styles.LoadingLogo}>
          <SiteLogo />
        </div>
        Twilight Imperium Assistant
      </div>
    </>
  );
}
