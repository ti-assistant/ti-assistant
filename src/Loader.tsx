export function Loader({}) {
  return (
    <div
      className="flexRow"
      style={{ width: "100%", maxHeight: "100svh", minHeight: "70svh" }}
    >
      <div className="lds-ripple">
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export function FullScreenLoader({}) {
  return (
    <div className="flexRow" style={{ width: "100vw", height: "100svh" }}>
      <div className="lds-ripple">
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
