import { CSSTransition } from "react-transition-group";
import { responsivePixels } from "./util/util";

export function Modal({ closeMenu, level, visible, title, content, top }) {
  const topValue = top ?? "5%";
  const zIndex = 900 * (level ?? 1);

  function onExited(node) {
    node.style.display = "none";
  }
  function onEnter(node) {
    node.style.display = "flex";
  }
  return (
    <CSSTransition
      in={visible}
      timeout={500}
      classNames="fade"
      onEnter={onEnter}
      onExited={onExited}
    >
    <div className={`flexColumn modal ${visible ? "shown" : ""}`} style={{position: "fixed", left: "0px", top: "0px", width: "100vw",
    height: "100vh", display: "none", zIndex: zIndex + 3,
    flexDirection: "column", alignItems: "center", color: "#eee"}}>

      <div style={{position: "absolute", width: "100vw", height: "100vh", backgroundColor: "black", opacity: "50%"}} onClick={closeMenu}>
  
      </div>
    <CSSTransition
      in={visible}
      timeout={500}
      classNames="modal"
    >
      <div style={{position: "relative", backgroundColor: "#222", maxWidth: "85%", maxHeight: "90vh", overflow: "auto"}}>  
      <div className="flexRow" style={{padding: responsivePixels(4), borderBottom: `${responsivePixels(1)} solid grey`, justifyContent: "flex-start", alignItems: "center", position: "sticky", top: 0, backgroundColor: "#222"}}>
        {closeMenu ? <div
            style={{
              color: "grey",
              cursor: "pointer",
              fontSize: responsivePixels(20),
              marginLeft: responsivePixels(6),
              position: "absolute",
              top: responsivePixels(4),
              zIndex: zIndex + 3,
            }}
            onClick={closeMenu}
          >
            &#x2715;
          </div> : null}
          <div style={{padding: `${responsivePixels(4)} ${responsivePixels(32)}`, textAlign: "center", flexBasis: "100%", fontSize: responsivePixels(40)}}>
            {title}
          </div>
        </div>
        <div className="flexColumn" style={{alignItems: "flex-start", padding: "0px 4px 4px 4px"}}>
          {content}
        </div>
      </div>
    </CSSTransition>
    </div>
    </CSSTransition>);
}
