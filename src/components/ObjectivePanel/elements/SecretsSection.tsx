import { use } from "react";
import { FormattedMessage } from "react-intl";
import { ModalContext } from "../../../context/contexts";
import { useGameId, useViewOnly } from "../../../context/dataHooks";
import {
  useObjectives,
  useObjectivesOfType,
} from "../../../context/objectiveDataHooks";
import {
  scoreObjectiveAsync,
  unscoreObjectiveAsync,
} from "../../../dynamic/api";
import { rem } from "../../../util/util";
import FactionComponents from "../../FactionComponents/FactionComponents";
import FactionIcon from "../../FactionIcon/FactionIcon";
import { ModalContent } from "../../Modal/Modal";
import ObjectiveRow from "../../ObjectiveRow/ObjectiveRow";
import ObjectiveSelectHoverMenu from "../../ObjectiveSelectHoverMenu/ObjectiveSelectHoverMenu";
import GridHeader from "./GridHeader";
import ObjectivesMenuSVG from "../../../icons/ui/ObjectivesMenu";

export default function SecretSection({
  numRows,
  orderedFactionIds,
  startingColumn,
}: {
  numRows: number;
  orderedFactionIds: FactionId[];
  startingColumn: number;
}) {
  const secretObjectives = useObjectivesOfType("SECRET");
  const { openModal } = use(ModalContext);

  const secretsByFaction: Partial<Record<FactionId, Objective[]>> = {};
  for (const secret of Object.values(secretObjectives)) {
    for (const scorer of secret.scorers ?? []) {
      const faction = secretsByFaction[scorer] ?? [];
      faction.push(secret);
      secretsByFaction[scorer] = faction;
    }
  }

  return (
    <>
      <div
        className="flexRow"
        style={{
          position: "absolute",
          width: "100%",
          zIndex: -1,
          opacity: 0.75,
          bottom: 0,
          gridColumn: `${startingColumn} / ${startingColumn + 1}`,
          gridRow: "1 / 2",
          borderRadius: "100%",
        }}
      >
        <ObjectivesMenuSVG borderColor="red" />
      </div>
      <div
        className="flexRow"
        style={{
          position: "absolute",
          zIndex: -1,
          width: "100%",
          height: "100%",
          gridColumn: `${startingColumn} / ${startingColumn + 1}`,
          gridRow: `2 / ${numRows + 1}`,
          borderLeft: `${"1px"} solid red`,
          borderRight: `${"1px"} solid grey`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            marginBottom: rem(-72),
            transform: "rotate(270deg)",
            transformOrigin: "left center",
            backgroundColor: "var(--background-color)",
            padding: `0 ${rem(4)}`,
            color: "red",
          }}
        >
          <FormattedMessage
            id="QrrIrN"
            description="The title of secret objectives."
            defaultMessage="Secrets"
          />
        </div>
      </div>
      <GridHeader></GridHeader>
      {orderedFactionIds.map((factionId) => {
        const factionSecrets = secretsByFaction[factionId] ?? [];
        let opacity = 1;
        switch (factionSecrets.length) {
          case 0:
            opacity = 0.2;
            break;
          case 1:
            opacity = 0.7;
            break;
          case 2:
            opacity = 0.85;
            break;
          case 3:
            opacity = 1;
            break;
        }
        return (
          <div
            key={factionId}
            className="flexRow"
            style={{
              cursor: "pointer",
              position: "relative",
              width: "100%",
              height: "100%",
              padding: `0 ${rem(4)}`,
              opacity: opacity,
            }}
            onClick={() => {
              openModal(
                <ModalContent
                  title={
                    <>
                      <FactionComponents.Name factionId={factionId} />{" "}
                      <FormattedMessage
                        id="QrrIrN"
                        description="The title of secret objectives."
                        defaultMessage="Secrets"
                      />
                    </>
                  }
                >
                  <SecretModalContent factionId={factionId} />
                </ModalContent>
              );
            }}
          >
            <FactionIcon factionId={factionId} size="80%" />
            <div
              className="flexRow"
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
              }}
            >
              <div
                className="flexRow"
                style={{
                  position: "absolute",
                  backgroundColor: "var(--light-bg)",
                  borderRadius: "100%",
                  marginLeft: "44%",
                  marginTop: "44%",
                  boxShadow: `${"1px"} ${"1px"} ${"4px"} black`,
                  width: rem(24),
                  height: rem(24),
                  zIndex: 2,
                }}
              >
                {factionSecrets.length}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

function SecretModalContent({ factionId }: { factionId: FactionId }) {
  const gameId = useGameId();
  const objectives = useObjectives();
  const viewOnly = useViewOnly();

  const secrets = Object.values(objectives ?? {}).filter(
    (objective) => objective.type === "SECRET"
  );

  const scoredSecrets = secrets.filter((secret) =>
    (secret.scorers ?? []).includes(factionId)
  );
  const availableSecrets = secrets
    .filter((secret) => (secret.scorers ?? []).length === 0)
    .sort((a, b) => {
      if (a.name > b.name) {
        return 1;
      }
      return -1;
    });

  return (
    <div
      className="flexColumn"
      style={{
        width: "100%",
        padding: rem(8),
        alignItems: "center",
      }}
    >
      {scoredSecrets.map((secret) => {
        return (
          <ObjectiveRow
            key={secret.name}
            objective={secret}
            hideScorers={true}
            removeObjective={
              viewOnly
                ? undefined
                : () => {
                    unscoreObjectiveAsync(gameId, factionId, secret.id);
                  }
            }
          />
        );
      })}
      <div
        className="flexRow"
        style={{ width: "100%", justifyContent: "flex-start" }}
      >
        {scoredSecrets.length < 6 && !viewOnly ? (
          <ObjectiveSelectHoverMenu
            action={(gameId, objectiveId) =>
              scoreObjectiveAsync(gameId, factionId, objectiveId)
            }
            fontSize={rem(14)}
            label={
              <FormattedMessage
                id="zlpl9F"
                defaultMessage="Score Secret Objective"
                description="Message telling a player to score a secret objective."
              />
            }
            objectives={availableSecrets}
            perColumn={10}
          />
        ) : null}
      </div>
    </div>
  );
}
