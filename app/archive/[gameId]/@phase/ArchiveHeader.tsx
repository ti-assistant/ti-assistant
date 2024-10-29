"use client";

import QRCode from "qrcode";
import React, { useContext, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { AgendaRow } from "../../../../src/AgendaRow";
import GameTimer from "../../../../src/components/GameTimer/GameTimer";
import GenericModal from "../../../../src/components/GenericModal/GenericModal";
import { GameIdContext } from "../../../../src/context/Context";
import {
  useAgendas,
  useFactions,
  useOptions,
  usePlanets,
} from "../../../../src/context/dataHooks";
import { ClientOnlyHoverMenu } from "../../../../src/HoverMenu";
import { getMalliceSystemNumber } from "../../../../src/util/map";
import { getMapString } from "../../../../src/util/options";
import { rem } from "../../../../src/util/util";
import styles from "./../../../../src/components/Header/Header.module.scss";
import Map from "./../../../../src/components/Map/Map";

const BASE_URL =
  process.env.GAE_SERVICE === "dev"
    ? "https://dev-dot-twilight-imperium-360307.wm.r.appspot.com"
    : "https://ti-assistant.com";

export default function ArchiveHeader() {
  const gameId = useContext(GameIdContext);
  const factions = useFactions();
  const options = useOptions();
  const planets = usePlanets();

  const intl = useIntl();

  const [qrCode, setQrCode] = useState<string>();

  const [showMap, setShowMap] = useState(false);

  if (!qrCode && gameId) {
    QRCode.toDataURL(
      `${BASE_URL}${
        intl.locale && intl.locale !== "en" ? `/${intl.locale}` : ""
      }/archive/${gameId}`,
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

  const mapString = getMapString(options, mapOrderedFactions.length);

  return (
    <React.Fragment>
      <GenericModal closeMenu={() => setShowMap(false)} visible={showMap}>
        <div
          style={{
            position: "relative",
            width: "min(100dvh, 100dvw)",
            height: "min(100dvh, 100dvw)",
          }}
        >
          <Map
            factions={mapOrderedFactions}
            mapString={mapString ?? ""}
            mapStyle={options ? options["map-style"] ?? "standard" : "standard"}
            mallice={getMalliceSystemNumber(options, planets, factions)}
          />
        </div>
      </GenericModal>
      {mapString ? (
        <button className={styles.Map} onClick={() => setShowMap(true)}>
          <FormattedMessage
            id="xDzJ9/"
            description="Text shown on a button that opens the map."
            defaultMessage="View Map"
          />
        </button>
      ) : null}
      <div className={styles.GameTimer}>
        <GameTimer frozen />
      </div>
      <PassedLaws />
    </React.Fragment>
  );
}

function PassedLaws() {
  const agendas = useAgendas();

  const passedLaws = Object.values(agendas).filter((agenda) => {
    return agenda.passed && agenda.type === "LAW";
  });

  if (passedLaws.length === 0) {
    return null;
  }

  return (
    <div className={styles.PassedLaws}>
      <ClientOnlyHoverMenu
        label={
          <FormattedMessage
            id="oiV4lE"
            description="Text on a hover menu that will display the current laws that have been passed."
            defaultMessage="Laws in Effect"
          />
        }
      >
        <div
          className="flexColumn"
          style={{ alignItems: "flex-start", padding: rem(8) }}
        >
          {passedLaws.map((agenda) => (
            <AgendaRow key={agenda.id} agenda={agenda} />
          ))}
        </div>
      </ClientOnlyHoverMenu>
    </div>
  );
}
