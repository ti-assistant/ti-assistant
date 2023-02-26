export function Loader({}) {
  return (
    <div className="flexRow" style={{ width: "100%", height: "100%" }}>
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
