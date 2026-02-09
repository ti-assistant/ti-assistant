import { use } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import objectives from "../../../../server/data/base/objectives";
import { SettingsContext } from "../../../context/contexts";
import { useOrderedFactionIds } from "../../../context/gameDataHooks";
import {
  revealObjectiveAsync,
  scoreObjectiveAsync,
  setObjectivePointsAsync,
  unscoreObjectiveAsync,
} from "../../../dynamic/api";
import { BLACK_BORDER_GLOW } from "../../../util/borderGlow";
import { getColorForFaction } from "../../../util/factions";
import { objectiveTypeString } from "../../../util/strings";
import { Optional } from "../../../util/types/types";
import { rem } from "../../../util/util";
import Chip from "../../Chip/Chip";
import FactionComponents from "../../FactionComponents/FactionComponents";
import FactionIcon from "../../FactionIcon/FactionIcon";
import FactionSelectRadialMenu from "../../FactionSelectRadialMenu/FactionSelectRadialMenu";
import LabeledDiv from "../../LabeledDiv/LabeledDiv";
import ObjectiveRow from "../../ObjectiveRow/ObjectiveRow";
import ObjectiveSelectHoverMenu from "../../ObjectiveSelectHoverMenu/ObjectiveSelectHoverMenu";
import CustodiansToken from "./CustodiansToken";
import ObjectiveGridSection from "./ObjectiveGridSection";
import ScorableFactionIcon from "./ScorableFactionIcon";
import SecretSection from "./SecretsSection";
import Styx from "./Styx";
import { useGameId, useOptions, useViewOnly } from "../../../context/dataHooks";
import {
  useObjectiveRevealOrder,
  useObjectives,
} from "../../../context/objectiveDataHooks";
import styles from "../ObjectivePanel.module.scss";

export default function ObjectiveGrid({ asModal }: { asModal?: boolean }) {
  const gameId = useGameId();
  const intl = useIntl();
  const objectives = useObjectives();
  const options = useOptions();
  const orderedFactionIds = useOrderedFactionIds("ALLIANCE");
  const revealOrder = useObjectiveRevealOrder();
  const viewOnly = useViewOnly();

  const { settings, updateSetting } = use(SettingsContext);

  const numRows = orderedFactionIds.length + 1;
  const description = settings["display-objective-description"];

  const objectiveArray = Object.values(objectives);

  const stageOneObjectives: Objective[] = objectiveArray.filter(
    (obj) => obj.type === "STAGE ONE",
  );
  const stageTwoObjectives: Objective[] = objectiveArray.filter(
    (obj) => obj.type === "STAGE TWO",
  );
  const secretObjectives = objectiveArray.filter(
    (obj) => obj.type === "SECRET",
  );

  const secretsByFaction: Partial<Record<FactionId, Objective[]>> = {};
  for (const secret of secretObjectives) {
    for (const scorer of secret.scorers ?? []) {
      const faction = secretsByFaction[scorer] ?? [];
      faction.push(secret);
      secretsByFaction[scorer] = faction;
    }
  }

  const selectedStageOneObjectives = stageOneObjectives
    .filter((obj) => obj && obj.selected)
    .sort((a, b) => {
      const aRevealOrder = revealOrder[a.id];
      const bRevealOrder = revealOrder[b.id];
      if (!aRevealOrder && !bRevealOrder) {
        if (a.name > b.name) {
          return 1;
        }
        return -1;
      }
      if (!aRevealOrder) {
        return -1;
      }
      if (!bRevealOrder) {
        return 1;
      }
      if (aRevealOrder > bRevealOrder) {
        return 1;
      }
      return -1;
    });
  const remainingStageOneObjectives = stageOneObjectives.filter(
    (obj) => !obj.selected,
  );
  const selectedStageTwoObjectives = stageTwoObjectives
    .filter((obj) => obj && obj.selected)
    .sort((a, b) => {
      const aRevealOrder = revealOrder[a.id];
      const bRevealOrder = revealOrder[b.id];
      if (!aRevealOrder && !bRevealOrder) {
        if (a.name > b.name) {
          return 1;
        }
        return -1;
      }
      if (!aRevealOrder) {
        return -1;
      }
      if (!bRevealOrder) {
        return 1;
      }
      if (aRevealOrder > bRevealOrder) {
        return 1;
      }
      return -1;
    });
  const remainingStageTwoObjectives = stageTwoObjectives.filter(
    (obj) => !obj.selected,
  );
  const remainingSecretObjectives = secretObjectives.filter(
    (obj) => !obj.selected,
  );

  const supportForTheThrone = objectives["Support for the Throne"];

  return (
    <div
      style={{
        position: "relative",
        display: "grid",
        rowGap: rem(4),
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        minHeight: 0,
        gridAutoFlow: "column",
        gridTemplateRows: `repeat(${numRows}, 2fr)`,
      }}
    >
      {/* TODO: Move to options menu */}
      <div
        className="flexRow"
        style={{
          fontSize: rem(12),
          position: "absolute",
          top: 0,
          right: 0,
          gap: rem(4),
          fontFamily: "Myriad Pro",
        }}
      >
        Display:
        <Chip
          toggleFn={() => {
            updateSetting("display-objective-description", false);
          }}
          selected={!description}
        >
          <FormattedMessage
            id="entq4x"
            description="Text on a button that will display titles."
            defaultMessage="Titles"
          />
        </Chip>
        <Chip
          toggleFn={() => {
            updateSetting("display-objective-description", true);
          }}
          selected={description}
        >
          <FormattedMessage
            id="e1q7sg"
            description="Text on a button that will display descriptions."
            defaultMessage="Descriptions"
          />
        </Chip>
      </div>
      {orderedFactionIds.map((name, index) => {
        const factionColor = getColorForFaction(name);
        return (
          <div
            key={name}
            className="flexColumn"
            style={{
              justifyContent: "center",
              padding: `0 ${rem(4)}`,
              height: "100%",
              position: "relative",
              borderRadius: rem(3),
              border: `${"2px"} solid ${factionColor}`,
              boxShadow:
                factionColor === "Black" ? BLACK_BORDER_GLOW : undefined,
              whiteSpace: "nowrap",
              // overflow: "hidden",
            }}
          >
            {(options["game-variant"] ?? "normal").startsWith("alliance") &&
            index % 2 !== 0 ? (
              <div
                style={{
                  position: "absolute",
                  left: rem(-4),
                  transform: "rotate(270deg)",
                  transformOrigin: "left bottom",
                  backgroundColor: "var(--background-color)",
                  padding: `0 ${rem(4)}`,
                }}
              >
                <FormattedMessage
                  id="Promissories.Alliance.Title"
                  defaultMessage="{count, plural, one {Alliance} other {Alliances}}"
                  description="Title of Promissory: Alliance"
                  values={{ count: 1 }}
                />
              </div>
            ) : null}
            <div
              style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                opacity: 0.5,
                zIndex: -1,
              }}
            >
              <FactionIcon factionId={name} size="100%" />
            </div>
            {<FactionComponents.Name factionId={name} />}
          </div>
        );
      })}
      <div
        className="flexColumn"
        style={{
          height: "100%",
          width: "100%",
          justifyContent: "flex-end",
          padding: `0 ${rem(4)}`,
        }}
      >
        <FormattedMessage
          id="PzyYtG"
          description="Shortened version of Victory Points."
          defaultMessage="{count, plural, =0 {VPs} one {VP} other {VPs}}"
          values={{ count: 2 }}
        />
      </div>
      {orderedFactionIds.map((name) => {
        return (
          <div
            key={name}
            className="flexRow"
            style={{
              width: "100%",
              height: "100%",
              fontSize: rem(24),
            }}
          >
            {<FactionComponents.VPs factionId={name} />}
          </div>
        );
      })}
      <div
        className="flexColumn"
        style={{
          gridColumn: "1 / 2",
          gridRow: "1 / 2",
          height: "100%",
          alignItems: "center",
          justifyContent: "flex-end",
          width: "100%",
          paddingTop: asModal ? undefined : rem(36),
        }}
      >
        {viewOnly ? null : (
          <LabeledDiv
            label={
              <FormattedMessage
                id="6L07nG"
                description="Text telling the user to reveal an objective."
                defaultMessage="Reveal Objective"
              />
            }
            style={{
              width: "min-content",
              gridRow: "1 / 2",
              fontSize: rem(14),
            }}
            innerStyle={{
              flexDirection: "column",
              alignItems: "stretch",
            }}
          >
            <div className="flexRow">
              <ObjectiveSelectHoverMenu
                action={revealObjectiveAsync}
                label={objectiveTypeString("STAGE ONE", intl)}
                objectives={remainingStageOneObjectives}
                fontSize={rem(14)}
                buttonStyle={{ fontSize: rem(14) }}
              />
              <ObjectiveSelectHoverMenu
                action={revealObjectiveAsync}
                label={objectiveTypeString("STAGE TWO", intl)}
                objectives={remainingStageTwoObjectives}
                fontSize={rem(14)}
                buttonStyle={{ fontSize: rem(14) }}
              />
            </div>
            <ObjectiveSelectHoverMenu
              action={revealObjectiveAsync}
              label={"Secret (as Public)"}
              objectives={remainingSecretObjectives}
              fontSize={rem(14)}
              buttonStyle={{ fontSize: rem(14) }}
              perColumn={10}
            />
          </LabeledDiv>
        )}
      </div>
      <ObjectiveGridSection
        type="STAGE ONE"
        selectedObjectives={selectedStageOneObjectives}
        startColumn={3}
      />
      <ObjectiveGridSection
        type="STAGE TWO"
        selectedObjectives={selectedStageTwoObjectives}
        startColumn={3 + selectedStageOneObjectives.length}
      />
      <SecretSection
        orderedFactionIds={orderedFactionIds}
        numRows={orderedFactionIds.length + 1}
        startingColumn={
          3 +
          selectedStageOneObjectives.length +
          selectedStageTwoObjectives.length
        }
      />
    </div>
  );
}
