import styles from "./Loader.module.scss";

export function Loader() {
  return (
    <div className={styles.Loader}>
      <div className={styles.RippleLoader}>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
