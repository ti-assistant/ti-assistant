interface ResourcesProps {
  resources: number;
  influence: number;
  height?: number;
}

export function ResponsiveResources({ resources, influence }: ResourcesProps) {
  return (
    <div
      className="flexRow"
      style={{
        position: "relative",
        flexShrink: 0,
        width: "36px",
        height: "50px",
      }}
    >
      <div
        style={{
          color: "#fad54d",
          lineHeight: "22px",
          fontSize: "22px",
          textShadow: `0 0 ${"4px"} #fad54d`,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          left: 0,
          top: 0,
          width: "22px",
          height: "22px",
          fontWeight: "bold",
        }}
      >
        &#9711;
      </div>
      <div
        style={{
          lineHeight: "22px",
          fontSize: "12px",
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          left: 0,
          top: 0,
          width: "22px",
          height: "22px",
        }}
      >
        {resources}
      </div>
      <div
        style={{
          color: "#72d4f7",
          lineHeight: "35px",
          fontSize: "35px",
          textShadow: `0 0 ${"4px"} #72d4f7`,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bottom: 0,
          right: 0,
          width: "28px",
          height: "35px",
        }}
      >
        &#x2B21;
      </div>
      <div
        style={{
          lineHeight: "35px",
          fontSize: "12px",
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bottom: 0,
          right: 0,
          width: "28px",
          height: "35px",
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
          textShadow: `0 0 ${"4px"} #fad54d`,
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
          textShadow: `0 0 ${"4px"} #72d4f7`,
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
        width: `${height * 0.72}px`,
        height: `${height}px`,
      }}
    >
      <div
        style={{
          color: "#fad54d",
          lineHeight: `${height * 0.44}px`,
          fontSize: `${height * 0.44}px`,
          textShadow: `0 0 ${"4px"} #fad54d`,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          left: 0,
          top: 0,
          width: `${height * 0.44}px`,
          height: `${height * 0.44}px`,
          fontWeight: "bold",
        }}
      >
        &#9711;
      </div>
      <div
        style={{
          lineHeight:`${height * 0.44}px`,
          fontSize: `${height * 0.24}px`,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          left: 0,
          top: 0,
          width: `${height * 0.44}px`,
          height: `${height * 0.44}px`,
        }}
      >
        {resources}
      </div>
      <div
        style={{
          color: "#72d4f7",
          lineHeight: `${height * 0.7}px`,
          fontSize: `${height * 0.7}px`,
          textShadow: `0 0 ${"4px"} #72d4f7`,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bottom: 0,
          right: 0,
          width: `${height * 0.56}px`,
          height: `${height * 0.7}px`,
        }}
      >
        &#x2B21;
      </div>
      <div
        style={{
          lineHeight: `${height * 0.7}px`,
          fontSize: `${height * 0.24}px`,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bottom: 0,
          right: 0,
          width: `${height * 0.56}px`,
          height: `${height * 0.7}px`,
        }}
      >
        {influence}
      </div>
    </div>
  );
}
