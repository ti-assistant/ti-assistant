"use client";

import QRCode from "qrcode";
import React, { useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { AgendaRow } from "../../AgendaRow";
import { ClientOnlyHoverMenu } from "../../HoverMenu";
import {
  useAgendas,
  useAllPlanets,
  useGameId,
  useOptions,
  usePlanets,
  useViewOnly,
} from "../../context/dataHooks";
import { useFactions } from "../../context/factionDataHooks";
import { useObjectives } from "../../context/objectiveDataHooks";
import { useGameState } from "../../context/stateDataHooks";
import { useSharedModal } from "../../data/SharedModal";
import {
  continueGameAsync,
  endGameAsync,
  repealAgendaAsync,
} from "../../dynamic/api";
import { computeVPs } from "../../util/factions";
import { getWormholeNexusSystemNumber } from "../../util/map";
import { getMapString } from "../../util/options";
import { rem } from "../../util/util";
import GameTimer from "../GameTimer/GameTimer";
import GameMap from "../Map/GameMap";
import UndoButton from "../UndoButton/UndoButton";
import styles from "./Header.module.scss";
import { enterPassword } from "../../util/api/enterPassword";

const BASE_URL =
  process.env.GAE_SERVICE === "dev"
    ? "https://dev-dot-twilight-imperium-360307.wm.r.appspot.com"
    : "https://ti-assistant.com";

export default function Header({ archive }: { archive?: boolean }) {
  const factions = useFactions();
  const gameId = useGameId();
  const objectives = useObjectives();
  const options = useOptions();
  const planets = usePlanets();
  const allPlanets = useAllPlanets();
  const state = useGameState();
  const viewOnly = useViewOnly();

  const passwordRef = useRef<HTMLInputElement>(null);

  const intl = useIntl();

  const [qrCode, setQrCode] = useState<string>();

  const { openModal } = useSharedModal();

  if (!qrCode && gameId) {
    QRCode.toDataURL(
      `${BASE_URL}${
        intl.locale && intl.locale !== "en" ? `/${intl.locale}` : ""
      }/game/${gameId}`,
      {
        color: {
          dark: "#eeeeeeff",
          light: "#222222ff",
        },
        width: 164,
        margin: 4,
      },
      (err, url) => {
        if (err) {
          throw err;
        }
        setQrCode(url);
      }
    );
  }

  const mapOrderedFactions = Object.values(factions ?? {}).sort(
    (a, b) => a.mapPosition - b.mapPosition
  );

  let gameFinished = false;
  if (options && factions) {
    switch (options["game-variant"]) {
      case "alliance-combined":
        Object.values(factions).forEach((faction) => {
          if (!faction.alliancePartner) {
            return;
          }
          if (
            computeVPs(factions, faction.id, objectives ?? {}) +
              computeVPs(factions, faction.alliancePartner, objectives ?? {}) >=
            options["victory-points"]
          ) {
            gameFinished = true;
          }
        });
        break;
      case "alliance-separate":
        Object.values(factions).forEach((faction) => {
          if (
            computeVPs(factions, faction.id, objectives ?? {}) >=
              options["secondary-victory-points"] &&
            faction.alliancePartner
          ) {
            if (
              computeVPs(factions, faction.alliancePartner, objectives ?? {}) >=
              options["victory-points"]
            ) {
              gameFinished = true;
            }
          }
        });
        break;
      default:
      case "normal":
        Object.values(factions).forEach((faction) => {
          if (
            computeVPs(factions, faction.id, objectives ?? {}) >=
            options["victory-points"]
          ) {
            gameFinished = true;
          }
        });
        break;
    }
  }

  const mapString = getMapString(options, mapOrderedFactions.length);

  return (
    <React.Fragment>
      {mapString ? (
        <button
          className={styles.Map}
          onClick={() =>
            openModal(
              <div
                style={{
                  position: "relative",
                  width: "min(100dvh, 100dvw)",
                  height: "min(100dvh, 100dvw)",
                }}
              >
                <GameMap
                  factions={mapOrderedFactions}
                  mapString={mapString}
                  mapStyle={options["map-style"]}
                  wormholeNexus={getWormholeNexusSystemNumber(
                    options,
                    planets,
                    factions
                  )}
                  planets={allPlanets}
                />
              </div>
            )
          }
        >
          <FormattedMessage
            id="xDzJ9/"
            description="Text shown on a button that opens the map."
            defaultMessage="View Map"
          />
        </button>
      ) : null}
      {state.phase !== "SETUP" ? (
        <div className={styles.GameTimer}>
          <GameTimer frozen={state.phase === "END"} />
        </div>
      ) : null}
      {viewOnly ? (
        <div className={styles.ControlButtons}>
          {archive ? null : (
            <div className="flexRow">
              <input
                ref={passwordRef}
                type="textbox"
                placeholder="Enter Password"
              ></input>
              <button
                onClick={() => {
                  const password = passwordRef.current?.value;
                  if (!password) {
                    return;
                  }
                  enterPassword(gameId, password);
                }}
              >
                Submit
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.ControlButtons}>
          <UndoButton gameId={gameId} />
          {gameFinished ? (
            state?.phase === "END" ? (
              <button
                style={{ fontSize: rem(24) }}
                onClick={() => {
                  if (!gameId) {
                    return;
                  }
                  continueGameAsync(gameId);
                }}
              >
                <FormattedMessage
                  id="7SZHCO"
                  description="Text shown on a button that will return to the game."
                  defaultMessage="Back to Game"
                />
              </button>
            ) : (
              <button
                style={{ fontFamily: "Slider", fontSize: rem(32) }}
                onClick={() => {
                  if (!gameId) {
                    return;
                  }
                  endGameAsync(gameId);
                }}
              >
                <FormattedMessage
                  id="vsuOf1"
                  description="Text shown on a button that will end the game."
                  defaultMessage="End Game"
                />
              </button>
            )
          ) : null}
        </div>
      )}
      <PassedLaws viewOnly={viewOnly} />
    </React.Fragment>
  );
}

function PassedLaws({ viewOnly }: { viewOnly?: boolean }) {
  const agendas = useAgendas();
  const gameId = useGameId();

  const passedLaws = Object.values(agendas).filter((agenda) => {
    return agenda.passed && agenda.type === "LAW";
  });
  async function removeAgenda(agendaId: AgendaId) {
    if (!gameId) {
      return;
    }
    const target = agendas[agendaId]?.target;
    if (!target) {
      return;
    }
    repealAgendaAsync(gameId, agendaId, target);
  }

  if (passedLaws.length === 0) {
    return null;
  }

  return (
    <div className={styles.PassedLaws}>
      <ClientOnlyHoverMenu
        label={
          <FormattedMessage
            id="9qHL4G"
            description="Text on a hover menu that will display the current laws that have been passed."
            defaultMessage="{count} {count, plural, one {Law} other {Laws}} in Effect"
            values={{ count: passedLaws.length }}
          />
        }
      >
        <div
          className="flexColumn"
          style={{ alignItems: "flex-start", padding: rem(8) }}
        >
          {passedLaws.map((agenda) => (
            <AgendaRow
              key={agenda.id}
              agenda={agenda}
              removeAgenda={removeAgenda}
            />
          ))}
        </div>
      </ClientOnlyHoverMenu>
    </div>
  );
}
