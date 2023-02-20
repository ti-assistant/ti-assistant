import { responsivePixels } from "./util/util";

export interface ResourcesProps {
  resources: number;
  influence: number;
}

export function Resources({ resources, influence }: ResourcesProps) {
  return (
    <div className="resourceBlock">
      <div className="resourceSymbol">&#9711;</div>
      <div className="resourceTextWrapper">{resources}</div>
      <div className="influenceSymbol">&#x2B21;</div>
      <div className="influenceTextWrapper">{influence}</div>
    </div>
  );
}

export function ResponsiveResources({ resources, influence }: ResourcesProps) {
  return (
    <div
      className="flexRow"
      style={{
        position: "relative",
        flexShrink: 0,
        width: responsivePixels(36),
        height: responsivePixels(50),
      }}
    >
      <div
        style={{
          color: "#fad54d",
          lineHeight: responsivePixels(22),
          fontSize: responsivePixels(22),
          textShadow: `0 0 ${responsivePixels(4)} #fad54d`,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          left: 0,
          top: 0,
          width: responsivePixels(22),
          height: responsivePixels(22),
          fontWeight: "bold",
        }}
      >
        &#9711;
      </div>
      <div
        style={{
          lineHeight: responsivePixels(22),
          fontSize: responsivePixels(12),
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          left: 0,
          top: 0,
          width: responsivePixels(22),
          height: responsivePixels(22),
        }}
      >
        {resources}
      </div>
      <div
        style={{
          color: "#72d4f7",
          lineHeight: responsivePixels(35),
          fontSize: responsivePixels(35),
          textShadow: `0 0 ${responsivePixels(4)} #72d4f7`,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bottom: 0,
          right: 0,
          width: responsivePixels(28),
          height: responsivePixels(35),
        }}
      >
        &#x2B21;
      </div>
      <div
        style={{
          lineHeight: responsivePixels(35),
          fontSize: responsivePixels(12),
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bottom: 0,
          right: 0,
          width: responsivePixels(28),
          height: responsivePixels(35),
        }}
      >
        {influence}
      </div>
    </div>
  );
}
