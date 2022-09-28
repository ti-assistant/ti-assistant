export function Modal({ closeMenu, level, visible, title, content, top }) {
  const topValue = top ?? "5%";
  const zIndex = 900 * (level ?? 1);
  return (
    <div style={{position: "fixed", left: "0px", top: "0px", width: "100%",
    height: "100%", display: visible ? "flex" : "none", zIndex: zIndex - 1,
    flexDirection: "column", alignItems: "center", color: "#eee"}}>

      <div style={{position: "absolute", width: "100%", height: "100%", backgroundColor: "black", opacity: "50%", zIndex: zIndex}} onClick={closeMenu}>
  
      </div>
      <div style={{position: "relative", backgroundColor: "#222", zIndex: zIndex + 1, width: "85%", maxHeight: "90%", overflow: "auto", top:topValue}}>  
      <div className="flexRow" style={{padding: "4px", borderBottom: "1px solid grey", justifyContent: "flex-start", alignItems: "center", position: "sticky", top: 0, backgroundColor: "#222", zIndex: zIndex + 2}}>
        {closeMenu ? <div
            style={{
              color: "grey",
              cursor: "pointer",
              fontSize: "20px",
              marginLeft: "6px",
              position: "absolute",
              top: "4px",
            }}
            onClick={closeMenu}
          >
            &#x2715;
          </div> : null}
          <div style={{textAlign: "center", flexBasis: "100%", fontSize: "24px"}}>
            {title}
          </div>
        </div>
        <div style={{padding: "0px 4px 4px 4px"}}>
          {content}
        </div>
      </div>
    </div>);
}
