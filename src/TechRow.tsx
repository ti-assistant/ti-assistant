import { ReactNode, useState } from "react";

import { SelectableRow } from "./SelectableRow";
import FactionIcon from "./components/FactionIcon/FactionIcon";
import Modal from "./components/Modal/Modal";
import TechIcon from "./components/TechIcon/TechIcon";
import { getTechColor } from "./util/techs";
import { responsiveNegativePixels, responsivePixels } from "./util/util";

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
  if (tech.type === "UPGRADE") {
    return (
      <div
        className="myriadPro flexColumn"
        style={{
          width: "100%",
          padding: responsivePixels(4),
          whiteSpace: "pre-line",
          textAlign: "center",
          fontSize: responsivePixels(32),
        }}
      >
        {tech.description ? tech.description.replaceAll("\\n", "\n") : null}
        {tech.abilities.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridAutoFlow: "row",
              whiteSpace: "nowrap",
              gridTemplateColumns: "repeat(2, 1fr)",
              fontFamily: "Slider",
              paddingLeft: responsivePixels(8),
              rowGap: responsivePixels(2),
              width: "100%",
            }}
          >
            {tech.abilities.map((ability) => {
              return <div key={ability}>{ability.toUpperCase()}</div>;
            })}
          </div>
        ) : null}
        <UnitStatBlock stats={tech.stats} />
      </div>
    );
  }
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
    </div>
  );
}

interface TechRowProps {
  className?: string;
  tech: Tech;
  removeTech?: (techId: TechId) => void;
  addTech?: (techId: TechId) => void;
  leftContent?: ReactNode;
  opts?: TechRowOptions;
}

interface TechRowOptions {
  hideInfo?: boolean;
  hideSymbols?: boolean;
  hideIcon?: boolean;
  fade?: boolean;
}

export function TechRow({
  className = "",
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
      itemId={tech.id}
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
          className={className}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            opacity: opts.fade ? 0.25 : undefined,
          }}
        >
          <div
            style={{
              position: "relative",
              // display: "flex",
              color: getTechColor(tech),
              zIndex: 0,

              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {tech.name}
            {tech.faction && !opts.hideIcon ? (
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
                <FactionIcon factionId={tech.faction} size={24} />
              </div>
            ) : null}
          </div>

          <div
            className="popupIcon"
            style={{
              display: opts.hideInfo ? "none" : "block",
              fontSize: responsivePixels(16),
            }}
            onClick={(e) => {
              e.stopPropagation();
              displayInfo();
            }}
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
              return <TechIcon key={index} type={prereq} size={20} />;
            })}
          </div>
        )}
      </div>
    </SelectableRow>
  );
}
