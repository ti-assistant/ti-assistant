import { FactionSymbol } from "./FactionCard";
import { useState } from "react";

function getFactionColor(color) {
  if (!color) {
    return "#555";
  }
  switch (color) {
    case "Blue":
      return "cornflowerblue";
    // case "Magenta":
    //   return "hotpink";
    // case "Green":
    //   return "mediumseagreen";
  }
  return color;
}

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
    width: opts.iconSize ? `${opts.iconSize}px` : "40px",
    height: opts.iconSize ? `${opts.iconSize}px` : "40px",
    position: "absolute",
    zIndex: 0,
    left: 0,
    width: "100%",
    opacity: opts.hideName ? "100%" : "60%",
  };

  const color = faction.passed ? "#555" : getFactionColor(faction.color);
  const name = faction.name ?? "Select Faction";
  const border = `3px solid ${color}`;

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
      menuButtonStyle.marginBottom = "4px";
      menuButtonStyle.justifyContent = "flex-start";
      menuButtonStyle.width = "100%";
      break;
    case "bottom":
      menuButtonStyle.top = "100%";
      menuButtonStyle.marginTop = "4px";
      menuButtonStyle.justifyContent = "flex-start";
      menuButtonStyle.width = "100%";
      break;
    case "left":
      menuButtonStyle.right = "100%";
      menuButtonStyle.marginRight = "4px";
      menuButtonStyle.height = "40px";
      menuButtonStyle.top = "0";
      break;
    case "right":
    default:
      menuButtonStyle.left = "100%";
      menuButtonStyle.marginLeft = "4px";
      menuButtonStyle.height = "40px";
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
          borderRadius: "5px",
          display: "flex",
          flexDirection: "column",
          border: border,
          fontSize: opts.fontSize ?? "24px",
          position: "relative",
          cursor: (onClick || (menuButtons ?? []).length !== 0) ? "pointer" : "auto",
          alignItems: "center",
          whiteSpace: "nowrap",
          padding: opts.hideName ? 0 : "0px 4px",
        }}
      >
        <div className="flexRow" style={{justifyContent: "flex-start", gap: "4px", padding: "0px 4px", height: opts.iconSize ? `${opts.iconSize}px` : "40px", minWidth: opts.iconSize ? `${opts.iconSize}px` : "40px"}}>
          {faction.name ? <div className="flexRow" style={iconStyle}>
            <FactionSymbol faction={name} size={opts.iconSize ?? 40} />
          </div> : null}
          {speaker ? <div style={{fontFamily: "Myriad Pro",
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
          </div> : null}
          {opts.hideName ? null : <div style={{ textAlign: "center", position: "relative"}}>{name}</div>}
        </div>
      </div>
      {menuButtons && menuButtons.length !== 0 ? <div className="flexColumn" style={menuButtonStyle}>
        <div className="flexColumn" style={{alignItems: "stretch", gap: "4px"}}>
          {menuButtons.map((button) => {
            return (
              <div key={button.text} style={{cursor: "pointer", gap: "4px", padding: "4px 8px", boxShadow: "1px 1px 4px black", backgroundColor: "#222", border: `2px solid ${color}`, borderRadius: "5px", fontSize: opts.fontSize ?? "16px"}} onClick={() => {hideMenu(); button.action()}}>{button.text}</div>)
          })}
        </div>
      </div> : null}
    </div>
  );
}