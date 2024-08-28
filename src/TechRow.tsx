import { ReactNode, useState } from "react";

import { FormattedMessage } from "react-intl";
import { SelectableRow } from "./SelectableRow";
import FactionIcon from "./components/FactionIcon/FactionIcon";
import Modal from "./components/Modal/Modal";
import TechIcon from "./components/TechIcon/TechIcon";
import { getTechColor } from "./util/techs";

export function UnitStat({
  name,
  stat,
}: {
  name: ReactNode;
  stat: number | string;
}) {
  return (
    <div
      className="centered"
      style={{
        width: "82px",
        boxSizing: "border-box",
        border: "1px solid #eee",
        borderRadius: "10px",
      }}
    >
      <div
        style={{
          fontSize: "24px",
          borderBottom: "1px solid #eee",
        }}
      >
        {stat}
      </div>
      <div style={{ lineHeight: "18px", fontSize: "11px", padding: "0px 6px" }}>
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
        gap: "3px",
        padding: `0px ${"4px"}`,
        margin: "4px 4px 4px 0px",
        fontFamily: "Slider",
        alignItems: "stretch",
        justifyContent: "center",
        boxSizing: "border-box",
      }}
    >
      <UnitStat
        name={
          <FormattedMessage
            id="Unit.Stats.Cost"
            defaultMessage="COST"
            description="Label for unit stat block - cost of the unit."
          />
        }
        stat={stats.cost ?? "-"}
      />
      <UnitStat
        name={
          <FormattedMessage
            id="Unit.Stats.Combat"
            defaultMessage="COMBAT"
            description="Label for unit stat block - combat value of the unit."
          />
        }
        stat={stats.combat ?? "-"}
      />
      <UnitStat
        name={
          <FormattedMessage
            id="Unit.Stats.Move"
            defaultMessage="MOVE"
            description="Label for unit stat block - move value of the unit."
          />
        }
        stat={stats.move ?? "-"}
      />
      <UnitStat
        name={
          <FormattedMessage
            id="Unit.Stats.Capacity"
            defaultMessage="CAPACITY"
            description="Label for unit stat block - capacity value of the unit."
          />
        }
        stat={stats.capacity ?? "-"}
      />
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
          padding: "4px",
          whiteSpace: "pre-line",
          textAlign: "center",
          fontSize: "32px",
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
              paddingLeft: "8px",
              rowGap: "2px",
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
        padding: "4px",
        whiteSpace: "pre-line",
        textAlign: "center",
        fontSize: "32px",
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
          title={<div style={{ fontSize: "40px" }}>{tech.name}</div>}
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
            }}
          >
            {tech.name}
            {tech.faction && !opts.hideIcon ? (
              <div
                style={{
                  position: "absolute",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  opacity: "70%",
                  height: "100%",
                  zIndex: -2,
                  top: "-4px",
                  right: "-16px",
                }}
              >
                <div
                  style={{
                    position: "relative",
                  }}
                >
                  <FactionIcon factionId={tech.faction} size={24} />
                </div>
              </div>
            ) : null}
          </div>

          <div
            className="popupIcon"
            style={{
              display: opts.hideInfo ? "none" : "block",
              fontSize: "16px",
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
