import { responsivePixels } from "./util/util";

export interface ResourcesProps {
  resources: number;
  influence: number;
  height?: number;
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

export function FullResources({ resources, influence }: ResourcesProps) {
  return (
    <div
      className="flexRow"
      style={{
        position: "relative",
        flexShrink: 0,
        width: "72%",
        height: "100%",
      }}
    >
      <div
        style={{
          color: "#fad54d",
          lineHeight: "44%",
          fontSize: "44%",
          textShadow: `0 0 ${responsivePixels(4)} #fad54d`,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          left: 0,
          top: 0,
          width: "44%",
          height: "44%",
          fontWeight: "bold",
        }}
      >
        &#9711;
      </div>
      <div
        style={{
          lineHeight: "44%",
          fontSize: "28%",
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          left: 0,
          top: 0,
          width: "44%",
          height: "44%",
        }}
      >
        {resources}
      </div>
      <div
        style={{
          color: "#72d4f7",
          lineHeight: "70%",
          fontSize: "70%",
          textShadow: `0 0 ${responsivePixels(4)} #72d4f7`,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bottom: 0,
          right: 0,
          width: "56%",
          height: "70%",
        }}
      >
        &#x2B21;
      </div>
      <div
        style={{
          lineHeight: "70%",
          fontSize: "24%",
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bottom: 0,
          right: 0,
          width: "56%",
          height: "70%",
        }}
      >
        {influence}
      </div>
    </div>
  );
}

export function CustomSizeResources({
  resources,
  influence,
  height = 50,
}: ResourcesProps) {
  return (
    <div
      className="flexRow"
      style={{
        position: "relative",
        flexShrink: 0,
        width: responsivePixels(height * 0.72),
        height: responsivePixels(height),
      }}
    >
      <div
        style={{
          color: "#fad54d",
          lineHeight: responsivePixels(height * 0.44),
          fontSize: responsivePixels(height * 0.44),
          textShadow: `0 0 ${responsivePixels(4)} #fad54d`,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          left: 0,
          top: 0,
          width: responsivePixels(height * 0.44),
          height: responsivePixels(height * 0.44),
          fontWeight: "bold",
        }}
      >
        &#9711;
      </div>
      <div
        style={{
          lineHeight: responsivePixels(height * 0.44),
          fontSize: responsivePixels(height * 0.24),
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          left: 0,
          top: 0,
          width: responsivePixels(height * 0.44),
          height: responsivePixels(height * 0.44),
        }}
      >
        {resources}
      </div>
      <div
        style={{
          color: "#72d4f7",
          lineHeight: responsivePixels(height * 0.7),
          fontSize: responsivePixels(height * 0.7),
          textShadow: `0 0 ${responsivePixels(4)} #72d4f7`,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bottom: 0,
          right: 0,
          width: responsivePixels(height * 0.56),
          height: responsivePixels(height * 0.7),
        }}
      >
        &#x2B21;
      </div>
      <div
        style={{
          lineHeight: responsivePixels(height * 0.7),
          fontSize: responsivePixels(height * 0.24),
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bottom: 0,
          right: 0,
          width: responsivePixels(height * 0.56),
          height: responsivePixels(height * 0.7),
        }}
      >
        {influence}
      </div>
    </div>
  );
}
