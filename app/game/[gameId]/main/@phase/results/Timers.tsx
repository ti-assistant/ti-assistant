import LabeledDiv from "../../../../../../src/components/LabeledDiv/LabeledDiv";
import TimerDisplay from "../../../../../../src/components/TimerDisplay/TimerDisplay";
import { useTimers } from "../../../../../../src/context/dataHooks";
import { useFactions } from "../../../../../../src/context/factionDataHooks";
import { getFactionColor } from "../../../../../../src/util/factions";
import { objectEntries, rem } from "../../../../../../src/util/util";

interface TimerData {
  longestTurn: number;
  numTurns: number;
}

export default function Timers({
  timerData,
}: {
  timerData: Partial<Record<FactionId, TimerData>>;
}) {
  const timers = useTimers();
  const factions = useFactions();

  return (
    <div
      className="flexColumn"
      style={{
        display: "grid",
        gridAutoFlow: "row",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        width: "fit-content",
        height: rem(450),
        justifyContent: "flex-start",
        alignItems: "flex-start",
        position: "relative",
      }}
    >
      {objectEntries(timers).map(([key, val]) => {
        if (typeof key !== "string") {
          return null;
        }
        if (!isFactionId(key)) {
          return null;
        }

        if (key === "Firmament" && !!timers["Obsidian"]) {
          return null;
        }

        const data = timerData[key];

        let time = val;
        let secondary = timers[`${key}-secondary`];
        let numTurns = data?.numTurns ?? 0;
        let longestTurn = data?.longestTurn ?? 0;

        if (key === "Obsidian") {
          numTurns += timerData["Firmament"]?.numTurns ?? 0;
          longestTurn = Math.max(
            longestTurn,
            timerData["Firmament"]?.longestTurn ?? 0,
          );
          time += timers["Firmament"] ?? 0;
          secondary += timers["Firmament-secondary"] ?? 0;
        }

        return (
          <LabeledDiv
            key={key}
            label={key}
            color={getFactionColor(factions[key])}
          >
            <div
              className="flexColumn"
              style={{ alignItems: "flex-start", gap: rem(2) }}
            >
              <div className="flexRow">
                Total Time:
                <TimerDisplay time={time} width={100} />
              </div>
              {data ? (
                <>
                  <div className="flexRow">Turns Taken: {numTurns}</div>

                  <div className="flexRow">
                    Longest Turn:
                    <TimerDisplay time={longestTurn} width={100} />
                  </div>
                  <div className="flexRow">
                    Average per Turn:
                    <TimerDisplay
                      time={Math.floor(time / numTurns)}
                      width={100}
                    />
                  </div>
                </>
              ) : null}
              {secondary ? (
                <div className="flexRow">
                  Secondary:
                  <TimerDisplay time={secondary} width={100} />
                </div>
              ) : null}
            </div>
          </LabeledDiv>
        );
      })}
    </div>
  );
}

function isFactionId(val: string): val is FactionId {
  switch (val) {
    case "Arborec":
    case "Argent Flight":
    case "Barony of Letnev":
    case "Clan of Saar":
    case "Council Keleres":
    case "Crimson Rebellion":
    case "Deepwrought Scholarate":
    case "Embers of Muaat":
    case "Emirates of Hacan":
    case "Empyrean":
    case "Federation of Sol":
    case "Firmament":
    case "Ghosts of Creuss":
    case "Last Bastion":
    case "L1Z1X Mindnet":
    case "Mahact Gene-Sorcerers":
    case "Mentak Coalition":
    case "Naalu Collective":
    case "Naaz-Rokha Alliance":
    case "Nekro Virus":
    case "Nomad":
    case "Obsidian":
    case "Ral Nel Consortium":
    case "Sardakk N'orr":
    case "Titans of Ul":
    case "Universities of Jol-Nar":
    case "Vuil'raith Cabal":
    case "Winnu":
    case "Xxcha Kingdom":
    case "Yin Brotherhood":
    case "Yssaril Tribes":

    case "Augurs of Ilyxum":
    case "Bentor Conglomerate":
    case "Berserkers of Kjalengard":
    case "Celdauri Trade Confederation":
    case "Cheiran Hordes":
    case "Dih-Mohn Flotilla":
    case "Edyn Mandate":
    case "Florzen Profiteers":
    case "Free Systems Compact":
    case "Ghemina Raiders":
    case "Ghoti Wayfarers":
    case "Gledge Union":
    case "Glimmer of Mortheus":
    case "Kollecc Society":
    case "Kortali Tribunal":
    case "Kyro Sodality":
    case "Lanefir Remnants":
    case "Li-Zho Dynasty":
    case "L'tokk Khrask":
    case "Mirveda Protectorate":
    case "Monks of Kolume":
    case "Myko-Mentori":
    case "Nivyn Star Kings":
    case "Nokar Sellships":
    case "Olradin League":
    case "Roh'Dhna Mechatronics":
    case "Savages of Cymiae":
    case "Shipwrights of Axis":
    case "Tnelis Syndicate":
    case "Vaden Banking Clans":
    case "Vaylerian Scourge":
    case "Veldyr Sovereignty":
    case "Zealots of Rhodun":
    case "Zelian Purifier":
      return true;
  }
  return false;
}
