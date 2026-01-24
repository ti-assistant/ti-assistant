import { use, useState } from "react";
import { FormattedMessage } from "react-intl";
import FullScreenModal from "../../modals/FullScreenModal";
import PlanetPanel, { PlanetPanelView } from "./PlanetPanel";
import Chip from "../Chip/Chip";
import { SettingsContext } from "../../context/contexts";

function PlanetModalSettings() {
  const { settings, updateSetting } = use(SettingsContext);
  const planetView = settings["planet-panel-view"];

  return (
    <>
      <FormattedMessage
        id="Z66nNr"
        description="Label for group of things you can view."
        defaultMessage="View"
      />
      :
      <Chip
        selected={planetView === "CLASSIC"}
        toggleFn={() => updateSetting("planet-panel-view", "CLASSIC")}
        fontSize={12}
      >
        Rows
      </Chip>
      <Chip
        selected={planetView === "GRID"}
        toggleFn={() => updateSetting("planet-panel-view", "GRID")}
        fontSize={12}
      >
        Grid
      </Chip>
    </>
  );
}

export default function PlanetModal() {
  return (
    <FullScreenModal
      title={
        <FormattedMessage
          id="1fNqTf"
          description="Planets."
          defaultMessage="Planets"
        />
      }
      settings={<PlanetModalSettings />}
    >
      <PlanetPanel />
    </FullScreenModal>
  );
}
