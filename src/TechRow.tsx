import { ReactNode, useState } from "react";
import Image from "next/image";

import { Modal } from "./Modal";
import { SelectableRow } from "./SelectableRow";
import { getTechColor } from "./util/techs";
import { responsiveNegativePixels, responsivePixels } from "./util/util";
import { FullFactionSymbol } from "./FactionCard";
import { Tech, TechType, UnitStats } from "./util/api/techs";

export interface TechIconProps {
  type: TechType;
  width: number | string;
  height: number | string;
}

export function TechIcon({ type, width, height }: TechIconProps) {
  switch (type) {
    case "RED":
      return (
        <Image
          src="/images/red_tech.webp"
          alt="Red Tech Skip"
          width={width}
          height={height}
        />
      );
    case "YELLOW":
      return (
        <Image
          src="/images/yellow_tech.webp"
          alt="Yellow Tech Skip"
          width={width}
          height={height}
        />
      );
    case "BLUE":
      return (
        <Image
          src="/images/blue_tech.webp"
          alt="Blue Tech Skip"
          width={width}
          height={height}
        />
      );
    case "GREEN":
      return (
        <Image
          src="/images/green_tech.webp"
          alt="Green Tech Skip"
          width={width}
          height={height}
        />
      );
  }
  return type;
}

export interface WrappedTechIconProps {
  type: TechType;
  size: number;
}

export function WrappedTechIcon({ type, size }: WrappedTechIconProps) {
  const width = responsivePixels(size + 2);
  const height = responsivePixels(size);
  return (
    <div style={{ position: "relative", width: width, height: height }}>
      <FullTechIcon type={type} />
    </div>
  );
}

export function TechSkipIcon({ size }: { size: number }) {
  const width = responsivePixels(size);
  const height = responsivePixels(size);
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        width: width,
        height: height,
        rowGap: responsivePixels(1),
      }}
    >
      <WrappedTechIcon type="RED" size={size / 2 - 2} />
      <WrappedTechIcon type="GREEN" size={size / 2 - 2} />
      <WrappedTechIcon type="BLUE" size={size / 2 - 2} />
      <WrappedTechIcon type="YELLOW" size={size / 2 - 2} />
    </div>
  );
}

export interface FullTechIconProps {
  type: TechType;
}

export function FullTechIcon({ type }: FullTechIconProps) {
  switch (type) {
    case "RED":
      return (
        <Image
          src="/images/red_tech.webp"
          alt="Red Tech"
          layout="fill"
          objectFit="contain"
        />
      );
    case "YELLOW":
      return (
        <Image
          src="/images/yellow_tech.webp"
          alt="Yellow Tech"
          layout="fill"
          objectFit="contain"
        />
      );
    case "BLUE":
      return (
        <Image
          src="/images/blue_tech.webp"
          alt="Blue Tech"
          layout="fill"
          objectFit="contain"
        />
      );
    case "GREEN":
      return (
        <Image
          src="/images/green_tech.webp"
          alt="Green Tech"
          layout="fill"
          objectFit="contain"
        />
      );
  }
  return null;
}

function UnitStat({ name, stat }: { name: string; stat: number | string }) {
  return (
    <div
      style={{
        width: responsivePixels(82),
        boxSizing: "border-box",
        border: "1px solid #eee",
        borderRadius: "10px",
      }}
    >
      <div
        style={{
          fontSize: responsivePixels(24),
          borderBottom: "1px solid #eee",
        }}
      >
        {stat}
      </div>
      <div style={{ fontSize: responsivePixels(14), padding: "0px 6px" }}>
        {name}
      </div>
    </div>
  );
}

function UnitStatBlock({ stats }: { stats?: UnitStats }) {
  if (!stats) {
    return null;
  }
  return (
    <div
      className="flexRow"
      style={{
        gap: responsivePixels(3),
        padding: `0px ${responsivePixels(4)}`,
        margin: "4px 4px 4px 0px",
        fontFamily: "Slider",
        alignItems: "stretch",
        justifyContent: "center",
        boxSizing: "border-box",
      }}
    >
      <UnitStat name="COST" stat={stats.cost ?? "-"} />
      <UnitStat name="COMBAT" stat={stats.combat ?? "-"} />
      <UnitStat name="MOVE" stat={stats.move ?? "-"} />
      <UnitStat name="CAPACITY" stat={stats.capacity ?? "-"} />
    </div>
  );
}

function InfoContent({ tech }: { tech: Tech }) {
  const description = tech.description.replaceAll("\\n", "\n");
  return (
    <div
      className="myriadPro"
      style={{
        width: "100%",
        padding: responsivePixels(4),
        whiteSpace: "pre-line",
        textAlign: "center",
        fontSize: responsivePixels(32),
      }}
    >
      {description}
      <UnitStatBlock stats={tech.stats} />
    </div>
  );
}

export interface TechRowProps {
  tech: Tech;
  removeTech?: (techName: string) => void;
  addTech?: (techName: string) => void;
  leftContent?: ReactNode;
  opts?: TechRowOptions;
}

export interface TechRowOptions {
  hideInfo?: boolean;
  hideSymbols?: boolean;
}

export function TechRow({
  tech,
  removeTech,
  addTech,
  leftContent,
  opts = {},
}: TechRowProps) {
  const [showInfoModal, setShowInfoModal] = useState(false);

  function displayInfo() {
    setShowInfoModal(true);
  }

  return (
    <SelectableRow
      itemName={tech.name}
      selectItem={addTech}
      removeItem={removeTech}
    >
      <div
        className="flexRow"
        style={{ width: "100%", justifyContent: "stretch" }}
      >
        <Modal
          closeMenu={() => setShowInfoModal(false)}
          level={2}
          visible={showInfoModal}
          title={
            <div style={{ fontSize: responsivePixels(40) }}>{tech.name}</div>
          }
        >
          <InfoContent tech={tech} />
        </Modal>
        {leftContent ? <div>{leftContent}</div> : null}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexGrow: 2,
            alignItems: "center",
          }}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              color: getTechColor(tech),
              zIndex: 0,
            }}
          >
            {tech.name}
            {tech.faction ? (
              <div
                style={{
                  position: "absolute",
                  opacity: "70%",
                  height: responsivePixels(20),
                  zIndex: -2,
                  top: responsiveNegativePixels(-4),
                  right: responsiveNegativePixels(-16),
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: responsivePixels(24),
                    height: responsivePixels(24),
                  }}
                >
                  <FullFactionSymbol faction={tech.faction} />
                </div>
              </div>
            ) : null}
          </div>

          <div
            className="popupIcon"
            style={{
              display: opts.hideInfo ? "none" : "block",
              fontSize: responsivePixels(16),
            }}
            onClick={displayInfo}
          >
            &#x24D8;
          </div>
        </div>
        {opts.hideSymbols ? null : (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              opacity: "80%",
              flexShrink: 0,
            }}
          >
            {tech.prereqs.map((prereq, index) => {
              return <WrappedTechIcon key={index} type={prereq} size={20} />;
            })}
          </div>
        )}
      </div>
    </SelectableRow>
  );
}
