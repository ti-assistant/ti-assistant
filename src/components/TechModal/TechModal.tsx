import { Dispatch, SetStateAction, use, useState } from "react";
import { FormattedMessage } from "react-intl";
import { SettingsContext } from "../../context/contexts";
import { useOptions } from "../../context/dataHooks";
import FullScreenModal from "../../modals/FullScreenModal";
import Chip from "../Chip/Chip";
import TechPanel from "./TechPanel";

function TechModalTitle({ expansions }: { expansions: Expansion[] }) {
  if (expansions.includes("TWILIGHTS FALL")) {
    return "Cards";
  }

  return (
    <FormattedMessage
      id="ys7uwX"
      description="Shortened version of technologies."
      defaultMessage="Techs"
    />
  );
}

function TechModalSettings({
  expansions,
  tfCardType,
  setTFCardType,
}: {
  expansions: Expansion[];
  tfCardType: TFCardType;
  setTFCardType: Dispatch<SetStateAction<TFCardType>>;
}) {
  const { settings, updateSetting } = use(SettingsContext);
  const groupTechsByFaction = settings["group-techs-by-faction"];

  if (expansions.includes("TWILIGHTS FALL")) {
    return (
      <>
        <FormattedMessage
          id="Z66nNr"
          description="Label for group of things you can view."
          defaultMessage="View"
        />
        :
        <Chip
          selected={tfCardType === "ABILITY"}
          toggleFn={() => setTFCardType("ABILITY")}
          fontSize={12}
        >
          <FormattedMessage
            id="I54oy6"
            defaultMessage="{count, plural, one {Ability} other {Abilities}}"
            description="Header for a section listing out abilities."
            values={{
              count: 2,
            }}
          />
        </Chip>
        <Chip
          selected={tfCardType === "GENOME"}
          toggleFn={() => setTFCardType("GENOME")}
          fontSize={12}
        >
          <FormattedMessage
            id="vi7bc7"
            defaultMessage="{count, plural, one {Genome} other {Genomes}}"
            description="Header for a section listing out genomes."
            values={{
              count: 2,
            }}
          />
        </Chip>
        <Chip
          selected={tfCardType === "UNIT_UPGRADE"}
          toggleFn={() => setTFCardType("UNIT_UPGRADE")}
          fontSize={12}
        >
          <FormattedMessage
            id="lGDH2d"
            description="Unit upgrade techs."
            defaultMessage="{count, plural, =0 {Upgrades} one {Upgrade} other {Upgrades}}"
            values={{ count: 2 }}
          />
        </Chip>
        <Chip
          selected={tfCardType === "PARADIGM"}
          toggleFn={() => setTFCardType("PARADIGM")}
          fontSize={12}
        >
          <FormattedMessage
            id="i9uwBj"
            description="Header for a section listing out paradigms."
            defaultMessage="{count, plural, one {Paradigm} other {Paradigms}}"
            values={{ count: 2 }}
          />
        </Chip>
      </>
    );
  }

  return (
    <>
      <FormattedMessage
        id="WvbM4Q"
        description="Label for a group of buttons for selecting which option to group by."
        defaultMessage="Group by"
      />
      :
      <Chip
        selected={!groupTechsByFaction}
        toggleFn={() => updateSetting("group-techs-by-faction", false)}
        fontSize={12}
      >
        <FormattedMessage
          id="ys7uwX"
          description="Shortened version of technologies."
          defaultMessage="Techs"
        />
      </Chip>
      <Chip
        selected={groupTechsByFaction}
        toggleFn={() => updateSetting("group-techs-by-faction", true)}
        fontSize={12}
      >
        <FormattedMessage
          id="r2htpd"
          description="Text on a button that will randomize factions."
          defaultMessage="Factions"
        />
      </Chip>
    </>
  );
}

export default function TechModalContent() {
  const { settings } = use(SettingsContext);
  const options = useOptions();

  const [tfCardType, setTFCardType] = useState<TFCardType>("ABILITY");

  const twilightsFallGame = options.expansions.includes("TWILIGHTS FALL");

  const groupTechsByFaction =
    settings["group-techs-by-faction"] || twilightsFallGame;

  return (
    <FullScreenModal
      title={<TechModalTitle expansions={options.expansions} />}
      settings={
        <TechModalSettings
          expansions={options.expansions}
          tfCardType={tfCardType}
          setTFCardType={setTFCardType}
        />
      }
    >
      <TechPanel byFaction={groupTechsByFaction} tfCardType={tfCardType} />
    </FullScreenModal>
  );
}
