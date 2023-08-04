import React, {
  CSSProperties,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { responsiveNegativePixels, responsivePixels } from "./util/util";

const BLACK_GLOW_COLOR = "#fff";
const BLACK_LINE_GLOW = `0 0 4px ${BLACK_GLOW_COLOR}, 0 0 4px ${BLACK_GLOW_COLOR}`;
export const BLACK_BORDER_GLOW = `0 0 4px ${BLACK_GLOW_COLOR}, 0 0 4px ${BLACK_GLOW_COLOR} inset`;
export const BLACK_TEXT_GLOW = `0 0 4px ${BLACK_GLOW_COLOR}, 0 0 4px ${BLACK_GLOW_COLOR}, 0 0 4px ${BLACK_GLOW_COLOR}`;

export interface LabeledDivProps {
  label?: ReactNode;
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

export function LabeledDiv({
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
  useLayoutEffect(() => {
    setMinWidth((labelWidth ?? 0) + 16);
  }, [labelWidth]);

  const padding = `${
    !!label ? responsivePixels(10) : responsivePixels(6)
  } ${responsivePixels(6)} ${responsivePixels(6)} ${responsivePixels(6)}`;
  const divStyle: CSSProperties = {
    position: "relative",
    gap: responsivePixels(8),
    border: `${responsivePixels(2)} solid ${color}`,
    borderRadius: responsivePixels(5),
    width: "100%",
    minWidth: minWidth,
    boxSizing: "border-box",
    padding: `${padding}`,
    alignItems: "flex-start",
    cursor: onClick ? "pointer" : "cursor",
    marginTop: !!label ? responsivePixels(4) : 0,
    boxShadow: color === "Black" ? BLACK_BORDER_GLOW : undefined,
    ...style,
  };
  const labelStyle: CSSProperties = {
    position: "absolute",
    whiteSpace: "nowrap",
    left: responsivePixels(6),
    top: responsiveNegativePixels(-12),
    backgroundColor: "#222",
    borderRadius: responsivePixels(5),
    // padding: `${responsivePixels(2)} ${responsivePixels(4)}`,
    color: `${color}`,
    textShadow: color === "Black" ? BLACK_TEXT_GLOW : undefined,
    maxWidth: opts.fixedWidth ? "calc(100% - 14px)" : undefined,
  };
  const rightLabelStyle: CSSProperties = {
    position: "absolute",
    whiteSpace: "nowrap",
    right: responsivePixels(6),
    top: responsiveNegativePixels(-12),
    backgroundColor: "#222",
    borderRadius: responsivePixels(5),
    padding: `${responsivePixels(2)} ${responsivePixels(4)}`,
    color: `${color}`,
    textShadow: color === "Black" ? BLACK_TEXT_GLOW : undefined,
  };
  return (
    <div className="flexColumn" style={divStyle} onClick={onClick}>
      {noBlur ? null : (
        <div
          style={{
            zIndex: "-2",
            boxSizing: "border-box",
            left: 0,
            top: 0,
            borderRadius: "5px",
            position: "absolute",
            width: "100%",
            height: "100%",
            backdropFilter: "blur(4px)",
            filter: "blur(0)",
          }}
        ></div>
      )}
      {!!label ? (
        <div className="mediumFont" ref={labelRef} style={labelStyle}>
          <div
            style={{
              overflow: "hidden",
              textOverflow: "clip",
              // maxWidth: "calc(100% - 18px)",
              margin: `${responsivePixels(2)} ${responsivePixels(
                4
              )} ${responsivePixels(2)}`,
            }}
          >
            {label}
          </div>
        </div>
      ) : null}
      {!!rightLabel ? (
        <div className="mediumFont" style={rightLabelStyle}>
          {rightLabel}
        </div>
      ) : null}
      {children}
    </div>
  );
}

export interface LabeledLineProps {
  color?: string;
  leftLabel?: ReactNode;
  label?: ReactNode;
  rightLabel?: ReactNode;
  style?: CSSProperties;
}

export function LabeledLine({
  leftLabel,
  label,
  rightLabel,
  style = {},
  color = "#999",
}: LabeledLineProps) {
  const divStyle: CSSProperties = {
    position: "relative",
    borderRadius: responsivePixels(5),
    width: "100%",
    alignItems: "flex-start",
    marginTop: !!label ? responsivePixels(4) : 0,
    gap: 0,
    ...style,
  };
  return (
    <div className="flexColumn" style={divStyle}>
      <hr
        style={{
          width: "100%",
          border: `1px solid ${color}`,
          boxShadow: color === "Black" ? BLACK_LINE_GLOW : undefined,
          marginTop: responsivePixels(8),
          marginBottom: responsivePixels(8),
        }}
      />
      {!!leftLabel ? (
        <div
          className="mediumFont leftLabel"
          style={{
            color: color,
            textShadow: color === "Black" ? BLACK_TEXT_GLOW : undefined,
          }}
        >
          {leftLabel}
        </div>
      ) : null}

      {!!label ? (
        <div className="flexRow" style={{ width: "100%" }}>
          <div
            className="flexRow mediumFont centerLabel"
            style={{
              color: color,
              textShadow: color === "Black" ? BLACK_TEXT_GLOW : undefined,
            }}
          >
            {label}
          </div>
        </div>
      ) : null}
      {!!rightLabel ? (
        <div
          className="mediumFont rightLabel"
          style={{
            color: color,
            textShadow: color === "Black" ? BLACK_TEXT_GLOW : undefined,
          }}
        >
          {rightLabel}
        </div>
      ) : null}
    </div>
  );
}
