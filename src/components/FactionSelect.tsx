import React, {
  CSSProperties,
  PropsWithChildren,
  ReactNode,
  useRef,
  useState,
} from "react";
import { FullFactionSymbol } from "../FactionCard";
import { SymbolX } from "../icons/svgs";
import { responsivePixels } from "../util/util";
import { FactionCircle } from "./FactionCircle";
import styles from "./FactionSelect.module.scss";

export interface FactionSelectProps {
  allowNone?: boolean;
  direction?: "up" | "down" | "left" | "right";
  selectedFaction?: string;
  options: string[];
  fadedOptions?: string[];
  onSelect: (
    factionName: string | undefined,
    prevFaction: string | undefined
  ) => void;
  size?: number;
  tag?: ReactNode;
  borderColor?: string;
  tagBorderColor?: string;
}

export function FactionSelectHoverMenu({
  allowNone = true,
  direction = "right",
  selectedFaction,
  options,
  fadedOptions = [],
  onSelect,
  size = 44,
  tag,
  borderColor = "#444",
  tagBorderColor = "#444",
}: PropsWithChildren<FactionSelectProps>) {
  const menu = useRef<HTMLDivElement>(null);
  const innerMenu = useRef<HTMLDivElement>(null);
  const [closing, setClosing] = useState(false);

  function closeFn() {
    if (!menu.current) {
      return;
    }
    menu.current.classList.remove("hover");
    setClosing(true);
    setTimeout(() => setClosing(false), 200);
  }

  const hoverMenuStyle: CSSProperties = {
    left: direction === "right" ? 0 : undefined,
    right: direction === "left" ? 0 : undefined,
    borderRadius: responsivePixels(Math.floor(size / 2)),
    border: `${responsivePixels(2)} solid ${borderColor}`,
  };

  return (
    <div
      className={`hoverParent largeFont`}
      onMouseEnter={() => {
        if (!menu.current || closing) {
          return;
        }
        menu.current.classList.add("hover");
      }}
      onMouseLeave={() => {
        if (!menu.current) {
          return;
        }
        menu.current.classList.remove("hover");
      }}
      ref={menu}
    >
      <FactionCircle
        borderColor={borderColor}
        factionName={selectedFaction}
        tag={tag}
        tagBorderColor={tagBorderColor}
        size={size}
      />
      <div
        className={`flexRow hoverRadio ${styles.hoverMenu} ` + direction}
        style={hoverMenuStyle}
        ref={innerMenu}
      >
        {selectedFaction && direction === "left" && allowNone ? (
          <div
            className={`flexRow ${styles.factionSelect}`}
            style={{
              width: responsivePixels(size - 4),
              height: responsivePixels(size - 4),
              fontSize: responsivePixels(size - 8),
              color: "#777",
            }}
            onClick={() => {
              closeFn();
              onSelect(undefined, selectedFaction);
            }}
          >
            <div
              className="flexRow"
              style={{
                position: "relative",
                width: responsivePixels(size - 10),
                height: responsivePixels(size - 10),
              }}
            >
              <SymbolX />
            </div>
          </div>
        ) : null}
        {direction === "right" ? (
          <div
            className="flexRow"
            style={{
              position: "relative",
              width: responsivePixels(size - 4),
              height: responsivePixels(size - 4),
              fontSize: responsivePixels(size - 8),
              color: "#777",
            }}
          >
            <div
              className="flexRow"
              style={{
                position: "relative",
                width: responsivePixels(size - 10),
                height: responsivePixels(size - 10),
              }}
            >
              {selectedFaction ? (
                <FullFactionSymbol faction={selectedFaction} />
              ) : (
                <SymbolX />
              )}
            </div>

            {tag ? (
              <div
                className={`flexRow ${styles.tag}`}
                style={{
                  border: `${responsivePixels(1)} solid ${tagBorderColor}`,
                  boxShadow: `${responsivePixels(1)} ${responsivePixels(
                    1
                  )} ${responsivePixels(4)} black`,
                  width: responsivePixels(24),
                  height: responsivePixels(24),
                }}
              >
                {tag}
              </div>
            ) : null}
          </div>
        ) : null}
        {options.map((factionName) => {
          if (factionName === selectedFaction) {
            return null;
          }
          return (
            <div
              key={factionName}
              className={`flexRow ${styles.factionSelect} ${
                fadedOptions.includes(factionName) ? styles.faded : ""
              }
            }`}
              style={{
                width: responsivePixels(size - 4),
                height: responsivePixels(size - 4),
              }}
              onClick={() => {
                closeFn();
                onSelect(factionName, selectedFaction);
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: responsivePixels(size - 10),
                  height: responsivePixels(size - 10),
                }}
              >
                <FullFactionSymbol faction={factionName} />
              </div>
            </div>
          );
        })}
        {selectedFaction && direction === "right" && allowNone ? (
          <div
            className={`flexRow ${styles.factionSelect}`}
            style={{
              width: responsivePixels(size - 4),
              height: responsivePixels(size - 4),
              fontSize: responsivePixels(size - 8),
              color: "#777",
            }}
            onClick={() => {
              closeFn();
              onSelect(undefined, selectedFaction);
            }}
          >
            <div
              className="flexRow"
              style={{
                position: "relative",
                width: responsivePixels(size - 10),
                height: responsivePixels(size - 10),
              }}
            >
              <SymbolX />
            </div>
          </div>
        ) : null}
        {direction === "left" ? (
          <div
            className="flexRow"
            style={{
              position: "relative",
              width: responsivePixels(size - 4),
              height: responsivePixels(size - 4),
              fontSize: responsivePixels(size - 8),
              color: "#777",
            }}
          >
            <div
              className="flexRow"
              style={{
                position: "relative",
                width: responsivePixels(size - 10),
                height: responsivePixels(size - 10),
              }}
            >
              {selectedFaction ? (
                <FullFactionSymbol faction={selectedFaction} />
              ) : (
                <SymbolX />
              )}
            </div>
            {tag ? (
              <div
                className={`flexRow ${styles.tag}`}
                style={{
                  border: `${responsivePixels(1)} solid ${tagBorderColor}`,
                  boxShadow: `${responsivePixels(1)} ${responsivePixels(
                    1
                  )} ${responsivePixels(4)} black`,
                  width: responsivePixels(24),
                  height: responsivePixels(24),
                }}
              >
                {tag}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function getRadialPosition(index: number, numOptions: number, size: number) {
  const radians = ((Math.PI * 2) / numOptions) * index;

  const center = (size * 3) / 2;
  const pos = {
    "--y-pos": responsivePixels(
      center - size * Math.cos(radians) - size / 2 + 2
    ),
    "--x-pos": responsivePixels(
      center - size * -Math.sin(radians) - size / 2 + 2
    ),
    "--initial-y": responsivePixels(size + 2),
    "--initial-x": responsivePixels(size + 2),
  };
  return pos;
}

interface SizeCSS extends CSSProperties {
  "--size": string;
}

export function FactionSelectRadialMenu({
  allowNone = true,
  direction = "right",
  selectedFaction,
  options,
  fadedOptions = [],
  onSelect,
  size = 44,
  tag,
  borderColor = "#444",
  tagBorderColor = "#444",
}: PropsWithChildren<FactionSelectProps>) {
  const menu = useRef<HTMLDivElement>(null);
  const innerMenu = useRef<HTMLDivElement>(null);
  const [closing, setClosing] = useState(false);

  function closeFn() {
    if (!menu.current) {
      return;
    }
    menu.current.classList.remove("hover");
    setClosing(true);
    setTimeout(() => setClosing(false), 200);
  }

  const hoverMenuStyle: SizeCSS = {
    "--size": responsivePixels(size),
    borderRadius: "100%",
    justifyContent: "center",
  };

  return (
    <div
      className={`hoverParent largeFont`}
      onMouseEnter={() => {
        if (!menu.current || closing) {
          return;
        }
        menu.current.classList.add("hover");
      }}
      onMouseLeave={() => {
        if (!menu.current) {
          return;
        }
        menu.current.classList.remove("hover");
      }}
      ref={menu}
    >
      {options.length > 0 ? (
        <React.Fragment>
          <div
            className={styles.hoverBackground}
            style={
              {
                "--size": responsivePixels(size),
                "--border-color": borderColor,
              } as CSSProperties
            }
          ></div>
          <div
            className={`flexRow hoverRadial ${styles.hoverRadial} ` + direction}
            style={hoverMenuStyle}
            ref={innerMenu}
          >
            {selectedFaction && direction === "left" && allowNone ? (
              <div
                className={`flexRow ${styles.factionSelect}`}
                style={{
                  width: responsivePixels(size - 4),
                  height: responsivePixels(size - 4),
                  fontSize: responsivePixels(size - 8),
                  color: "#777",
                }}
                onClick={() => {
                  closeFn();
                  onSelect(undefined, selectedFaction);
                }}
              >
                <div
                  className="flexRow"
                  style={{
                    position: "relative",
                    width: responsivePixels(size - 10),
                    height: responsivePixels(size - 10),
                  }}
                >
                  <SymbolX />
                </div>
              </div>
            ) : null}
            {options.map((factionName, index) => {
              return (
                <div
                  key={factionName}
                  className={`flexRow ${styles.factionSelect} ${
                    fadedOptions.includes(factionName) &&
                    factionName !== selectedFaction
                      ? styles.faded
                      : ""
                  }
            }`}
                  style={
                    {
                      "--opacity":
                        fadedOptions.includes(factionName) &&
                        factionName !== selectedFaction
                          ? 0.25
                          : 1,
                      position: "absolute",
                      width: responsivePixels(size - 4),
                      height: responsivePixels(size - 4),
                      ...getRadialPosition(index, options.length, size),
                    } as CSSProperties
                  }
                  onClick={() => {
                    closeFn();
                    if (factionName === selectedFaction) {
                      onSelect(undefined, selectedFaction);
                      return;
                    }
                    onSelect(factionName, selectedFaction);
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: responsivePixels(size - 10),
                      height: responsivePixels(size - 10),
                    }}
                  >
                    {factionName === selectedFaction ? (
                      <SymbolX />
                    ) : (
                      <FullFactionSymbol faction={factionName} />
                    )}
                  </div>
                </div>
              );
            })}
            {direction === "right" ? (
              <div
                className="flexRow"
                style={{
                  position: "relative",
                  width: responsivePixels(size - 2),
                  height: responsivePixels(size - 2),
                  borderRadius: "100%",
                  border: `${responsivePixels(1)} solid ${borderColor}`,
                  boxShadow: `0px 0px ${responsivePixels(8)} black`,
                  backgroundColor: "#222",
                }}
              >
                <div
                  className="flexRow"
                  style={{
                    position: "relative",
                    width: responsivePixels(size - 4),
                    height: responsivePixels(size - 4),
                    fontSize: responsivePixels(size - 8),
                    color: "#777",
                  }}
                >
                  <div
                    className="flexRow"
                    style={{
                      position: "relative",
                      width: responsivePixels(size - 10),
                      height: responsivePixels(size - 10),
                    }}
                  >
                    {selectedFaction ? (
                      <FullFactionSymbol faction={selectedFaction} />
                    ) : (
                      <SymbolX />
                    )}
                  </div>

                  {tag ? (
                    <div
                      className={`flexRow ${styles.tag}`}
                      style={{
                        border: `${responsivePixels(
                          1
                        )} solid ${tagBorderColor}`,
                        boxShadow: `${responsivePixels(1)} ${responsivePixels(
                          1
                        )} ${responsivePixels(4)} black`,
                        width: responsivePixels(24),
                        height: responsivePixels(24),
                      }}
                    >
                      {tag}
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </React.Fragment>
      ) : null}
      <FactionCircle
        borderColor={borderColor}
        factionName={selectedFaction}
        tag={tag}
        tagBorderColor={tagBorderColor}
        size={size}
      />
    </div>
  );
}
