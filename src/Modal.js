export function Modal({ closeMenu, level, visible, title, content, top }) {
  const topValue = top ?? "5%";
  const zIndex = 900 * (level ?? 1);
  return (
    <div className="flexColumn" style={{position: "fixed", left: "0px", top: "0px", width: "100%",
    height: "100%", display: visible ? "flex" : "none", zIndex: zIndex + 3,
    flexDirection: "column", alignItems: "center", color: "#eee"}}>

      <div style={{position: "absolute", width: "100%", height: "100%", backgroundColor: "black", opacity: "50%"}} onClick={closeMenu}>
  
      </div>
      <div style={{position: "relative", backgroundColor: "#222", maxWidth: "85%", maxHeight: "90vh", overflow: "auto"}}>  
      <div className="flexRow" style={{padding: "4px", borderBottom: "1px solid grey", justifyContent: "flex-start", alignItems: "center", position: "sticky", top: 0, backgroundColor: "#222", zIndex: 1}}>
        {closeMenu ? <div
            style={{
              color: "grey",
              cursor: "pointer",
              fontSize: "20px",
              marginLeft: "6px",
              position: "absolute",
              top: "4px",
              zIndex: zIndex + 3,
            }}
            onClick={closeMenu}
          >
            &#x2715;
          </div> : null}
          <div style={{padding: "4px 32px", textAlign: "center", flexBasis: "100%", fontSize: "24px"}}>
            {title}
          </div>
        </div>
        <div className="flexColumn" style={{zIndex: -1, alignItems: "flex-start", padding: "0px 4px 4px 4px"}}>
          {content}
        </div>
      </div>
    </div>);
}
