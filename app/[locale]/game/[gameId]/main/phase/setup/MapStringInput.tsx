import { useEffect, useRef } from "react";
import { useIntl } from "react-intl";
import {
  useGameId,
  useOptions,
} from "../../../../../../../src/context/dataHooks";
import { useNumFactions } from "../../../../../../../src/context/factionDataHooks";
import { useChangeOption } from "../../../../../../../src/util/api/changeOption";
import { processMapString } from "../../../../../../../src/util/map";
import { rem } from "../../../../../../../src/util/util";

export default function MapStringInput() {
  const changeOption = useChangeOption();
  const gameId = useGameId();
  const intl = useIntl();
  const numFactions = useNumFactions();
  const options = useOptions();

  const mapStringRef = useRef<HTMLInputElement>(null);

  function setMapString(
    gameId: string,
    mapString: string,
    mapStyle: MapStyle,
    numFactions: number,
    thundersEdge: boolean,
  ) {
    changeOption(gameId, "map-string", mapString);
    if (mapString === "") {
      changeOption(gameId, "processed-map-string", "");
      return;
    }

    changeOption(
      gameId,
      "processed-map-string",
      processMapString(mapString, mapStyle, numFactions, thundersEdge),
    );
  }

  const userMapString = options["map-string"];
  useEffect(() => {
    if (!mapStringRef.current || !userMapString) {
      return;
    }
    mapStringRef.current.value = userMapString ?? "";
  }, [userMapString]);

  return (
    <input
      ref={mapStringRef}
      type="textbox"
      className="smallFont"
      style={{
        width: `min(75vw, ${rem(268)})`,
      }}
      pattern={"((([0-9]{1,4}((A|B)[0-5]?)?)|(P[1-8])|(-1))($|\\s))+"}
      placeholder={
        userMapString !== ""
          ? userMapString
          : intl.formatMessage({
              id: "UJSVtn",
              description:
                "Label for a textbox used to specify the map string.",
              defaultMessage: "Map String",
            })
      }
      onBlur={(event) =>
        setMapString(
          gameId,
          event.currentTarget.value,
          options["map-style"],
          numFactions,
          options.expansions.includes("THUNDERS EDGE"),
        )
      }
    ></input>
  );
}
