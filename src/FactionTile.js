import { FactionSymbol, FullFactionSymbol } from "./FactionCard";
import { useState } from "react";
import { getFactionColor, getFactionName } from "./util/factions";
import { responsivePixels } from "./util/util";

/**
 *
 */
export function BasicFactionTile({ faction, onClick, speaker, menuButtons, opts = {} }) {
  const [showMenu, setShowMenu] = useState(false);

  function toggleMenu() {
    setShowMenu(!showMenu);
  }

  function hideMenu() {
    setShowMenu(false);
  }

  const iconStyle = {
    width: opts.iconSize ? responsivePixels(opts.iconSize) : responsivePixels(40),
    height: opts.iconSize ? responsivePixels(opts.iconSize) : responsivePixels(40),
    position: "absolute",
    zIndex: 0,
    left: 0,
    width: "100%",
    opacity: opts.hideName ? "100%" : "60%",
  };

  const color = faction.passed ? "#555" : getFactionColor(faction);
  const name = faction.name ?? "Select Faction";
  const border = `${responsivePixels(3)} solid ${color}`;

  const menuButtonStyle = {
    fontFamily: "Myriad Pro",
    whiteSpace: "nowrap",
    position: "absolute",
    display: showMenu ? "flex" : "none",
    zIndex: 10
  };
  switch (opts.menuSide) {
    case "top":
      menuButtonStyle.bottom = "100%";
      menuButtonStyle.marginBottom = responsivePixels(4);
      menuButtonStyle.justifyContent = "flex-start";
      menuButtonStyle.width = "100%";
      break;
    case "bottom":
      menuButtonStyle.top = "100%";
      menuButtonStyle.marginTop = responsivePixels(4);
      menuButtonStyle.justifyContent = "flex-start";
      menuButtonStyle.width = "100%";
      break;
    case "left":
      menuButtonStyle.right = "100%";
      menuButtonStyle.marginRight = responsivePixels(4);
      menuButtonStyle.height = responsivePixels(40);
      menuButtonStyle.top = "0";
      break;
    case "right":
    default:
      menuButtonStyle.left = "100%";
      menuButtonStyle.marginLeft = responsivePixels(4);
      menuButtonStyle.height = responsivePixels(40);
      menuButtonStyle.top = "0";
      break;
  }

  return (
    <div
      style={{position: "relative"}}
      tabIndex={0}
      onBlur={onClick ? () => {} : hideMenu}>
      <div
        onClick={onClick ? onClick : toggleMenu}
        style={{
          borderRadius: responsivePixels(5),
          display: "flex",
          flexDirection: "column",
          border: border,
          fontSize: opts.fontSize ?? responsivePixels(24),
          position: "relative",
          cursor: (onClick || (menuButtons ?? []).length !== 0) ? "pointer" : "auto",
          alignItems: "center",
          whiteSpace: "nowrap",
          backgroundColor: "#222",
          padding: opts.hideName ? 0 : `0 ${responsivePixels(4)}`,
        }}
      >
        <div className="flexRow" style={{justifyContent: "flex-start", gap: responsivePixels(4), padding: "0px 4px", height: opts.iconSize ? responsivePixels(opts.iconSize) : responsivePixels(40), minWidth: opts.iconSize ? responsivePixels(opts.iconSize) : responsivePixels(40)}}>
          {faction.name ? <div className="flexRow" style={iconStyle}>
            <FullFactionSymbol faction={name} size={opts.iconSize ?? 40} />
          </div> : null}
          {/* {speaker ? <div style={{fontFamily: "Myriad Pro",
            position: "absolute",
            color: color === "Black" ? "#eee" : color,
            borderRadius: "5px",
            border: `2px solid ${color}`,
            padding: "0px 2px",
            fontSize: "12px",
            top: "-10px",
            left: "4px",
            zIndex: 1,
            backgroundColor: "#222"}}>
            Speaker
          </div> : null} */}
          {opts.hideName ? null : <div style={{ textAlign: "center", position: "relative"}}>{getFactionName(faction)}</div>}
        </div>
      </div>
      {menuButtons && menuButtons.length !== 0 ? <div className="flexColumn" style={menuButtonStyle}>
        <div className="flexColumn" style={{alignItems: "stretch", gap: responsivePixels(4)}}>
          {menuButtons.map((button) => {
            return (
              <div key={button.text} style={{cursor: "pointer", gap: responsivePixels(4), padding: `${responsivePixels(4)} ${responsivePixels(8)}`, boxShadow: `${responsivePixels(1)} ${responsivePixels(1)} ${responsivePixels(4)} black`, backgroundColor: "#222", border: `${responsivePixels(2)} solid ${color}`, borderRadius: responsivePixels(5), fontSize: opts.fontSize ?? responsivePixels(16)}} onClick={() => {hideMenu(); button.action()}}>{button.text}</div>)
          })}
        </div>
      </div> : null}
    </div>
  );
}