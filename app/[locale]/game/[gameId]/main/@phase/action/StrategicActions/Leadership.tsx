import { FormattedMessage } from "react-intl";
import GainCommandTokens from "../../../../../../../../src/components/Actions/GainCCs";
import Conditional from "../../../../../../../../src/components/Conditional/Conditional";
import FactionComponents from "../../../../../../../../src/components/FactionComponents/FactionComponents";
import LabeledDiv from "../../../../../../../../src/components/LabeledDiv/LabeledDiv";
import { useFactionColor } from "../../../../../../../../src/context/factionDataHooks";
import { useOrderedFactionIds } from "../../../../../../../../src/context/gameDataHooks";
import { rem } from "../../../../../../../../src/util/util";

const Leadership = {
  Primary,
  Secondary,
  AllSecondaries,
};

export default Leadership;

function Primary({ factionId }: { factionId: FactionId }) {
  return (
    <Conditional appSection="COMMAND_COUNTERS">
      <div className="flexColumn">
        <FormattedMessage
          id="t5fXQR"
          description="Text telling a player how many command tokens to gain."
          defaultMessage="Gain {count} command {count, plural, one {token} other {tokens}}"
          values={{ count: 3 }}
        />
        <GainCommandTokens factionId={factionId} />
      </div>
    </Conditional>
  );
}

function Secondary({ factionId }: { factionId: FactionId }) {
  const factionColor = useFactionColor(factionId);
  return (
    <Conditional appSection="COMMAND_COUNTERS">
      <LabeledDiv
        label={<FactionComponents.Name factionId={factionId} />}
        color={factionColor}
        blur
      >
        <GainCommandTokens factionId={factionId} />
      </LabeledDiv>
    </Conditional>
  );
}

function AllSecondaries({ activeFactionId }: { activeFactionId: FactionId }) {
  const orderedFactionIds = useOrderedFactionIds("MAP");

  return (
    <Conditional appSection="COMMAND_COUNTERS">
      <div
        className="flexRow mediumFont"
        style={{
          paddingTop: rem(4),
          width: "100%",
          flexWrap: "wrap",
        }}
      >
        {orderedFactionIds.map((factionId) => {
          if (factionId === activeFactionId) {
            return null;
          }
          return (
            <div key={factionId} style={{ width: "48%" }}>
              <Secondary factionId={factionId} />
            </div>
          );
        })}
      </div>
    </Conditional>
  );
}
