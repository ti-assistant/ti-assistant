"use client";
import { useState, useEffect } from "react";
import { Optional } from "../../src/util/types/types";
import { rem } from "../../src/util/util";
import DarkModeSVG from "../../src/icons/ui/DarkModeSVG";
import LightModeSVG from "../../src/icons/ui/LightMode";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(
    (global.window as Optional<any>)?.__theme || "dark",
  );

  const isDark = theme === "dark";

  const toggleTheme = () => {
    (global.window as Optional<any>)?.__setPreferredTheme(
      theme === "light" ? "dark" : "light",
    );
  };

  useEffect(() => {
    (global.window as Optional<any>).__onThemeChange = setTheme;
  }, []);

  return (
    <button
      className="iconButton"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "100%",
        width: rem(32),
        height: rem(32),
        fontSize: "1rem",
      }}
      onClick={toggleTheme}
    >
      <div className="flexRow" style={{ width: rem(24), height: rem(24) }}>
        {isDark ? <DarkModeSVG /> : <LightModeSVG />}
      </div>
    </button>
  );
};

export default ThemeToggle;
