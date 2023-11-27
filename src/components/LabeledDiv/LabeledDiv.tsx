import {
  CSSProperties,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { BLACK_BORDER_GLOW, BLACK_TEXT_GLOW } from "../../util/borderGlow";
import { responsivePixels } from "../../util/util";
import styles from "./LabeledDiv.module.scss";

interface LabeledDivProps {
  label: ReactNode;
  noBlur?: boolean;
  onClick?: () => void;
  rightLabel?: ReactNode;
  style?: CSSProperties;
  color?: string;
  opts?: LabeledDivOpts;
}

interface LabeledDivOpts {
  fixedWidth?: boolean;
}

interface LabeledDivCSS extends CSSProperties {
  "--color": string;
}

export default function LabeledDiv({
  label,
  rightLabel,
  children,
  noBlur,
  onClick,
  style = {},
  color = "#999",
  opts = {},
}: PropsWithChildren<LabeledDivProps>) {
  const [minWidth, setMinWidth] = useState<number | undefined>();
  const labelRef = useRef<HTMLDivElement>(null);

  const labelWidth = labelRef.current?.clientWidth;
  useEffect(() => {
    changeLabelWidth();
  }, [labelWidth, label]);

  function changeLabelWidth() {
    const labelWidth = labelRef.current?.clientWidth;
    setMinWidth((labelWidth ?? 0) + 16);
  }

  const padding = `${
    !!label ? responsivePixels(10) : responsivePixels(6)
  } ${responsivePixels(6)} ${responsivePixels(6)} ${responsivePixels(6)}`;
  const divStyle: LabeledDivCSS = {
    "--color": color,
    minWidth: minWidth,
    padding: `${padding}`,
    cursor: onClick ? "pointer" : "cursor",
    marginTop: !!label ? responsivePixels(4) : 0,
    boxShadow: color === "Black" ? BLACK_BORDER_GLOW : undefined,
    ...style,
  };
  return (
    <div
      className={`flexColumn ${styles.LabeledDiv}`}
      style={divStyle}
      onClick={onClick}
    >
      {noBlur ? null : <div className={styles.blurBox}></div>}
      {!!label ? (
        <div
          className={`${styles.label} ${styles.left}`}
          ref={labelRef}
          style={{
            maxWidth: opts.fixedWidth ? "calc(100% - 14px)" : undefined,
            textShadow: color === "Black" ? BLACK_TEXT_GLOW : undefined,
          }}
        >
          <div
            style={{
              padding:
                color === "Black" ? `0 ${responsivePixels(4)}` : undefined,
            }}
          >
            {label}
          </div>
        </div>
      ) : null}
      {!!rightLabel ? (
        <div
          className={`${styles.label} ${styles.right}`}
          style={{
            textShadow: color === "Black" ? BLACK_TEXT_GLOW : undefined,
          }}
        >
          {rightLabel}
        </div>
      ) : null}
      {children}
    </div>
  );
}
