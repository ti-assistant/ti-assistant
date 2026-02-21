import { FormattedMessage, useIntl } from "react-intl";
import LabeledDiv from "../../../../../../../../src/components/LabeledDiv/LabeledDiv";
import TechResearchSection from "../../../../../../../../src/components/TechResearchSection/TechResearchSection";
import TechSelectHoverMenu from "../../../../../../../../src/components/TechSelectHoverMenu/TechSelectHoverMenu";
import {
  useCurrentTurn,
  useOptions,
  useTechs,
} from "../../../../../../../../src/context/dataHooks";
import { useFaction } from "../../../../../../../../src/context/factionDataHooks";
import { TechRow } from "../../../../../../../../src/TechRow";
import {
  getReplacedTechs,
  getResearchedTechs,
} from "../../../../../../../../src/util/actionLog";
import { useDataUpdate } from "../../../../../../../../src/util/api/dataUpdate";
import { Events } from "../../../../../../../../src/util/api/events";
import { hasTech } from "../../../../../../../../src/util/api/techs";
import { objectKeys } from "../../../../../../../../src/util/util";

export default function DivertFunding({ factionId }: { factionId: FactionId }) {
  const currentTurn = useCurrentTurn();
  const dataUpdate = useDataUpdate();
  const faction = useFaction(factionId);
  const intl = useIntl();
  const options = useOptions();
  const techs = useTechs();

  if (!faction || !techs) {
    return null;
  }

  if (options.hide?.includes("TECHS")) {
    return null;
  }

  const returnedTechs = getReplacedTechs(currentTurn, factionId);
  const canReturnTechs = objectKeys(faction.techs)
    .filter((techId) => {
      const techObj = techs[techId];
      if (!techObj) {
        return false;
      }
      if (!hasTech(faction, techObj)) {
        return false;
      }
      return !techObj.faction && techObj.type !== "UPGRADE";
    })
    .map((techId) => techs[techId])
    .filter((tech) => !!tech);
  const researchedTech = getResearchedTechs(currentTurn, factionId);

  return (
    <div className="flexColumn" style={{ width: "100%" }}>
      {returnedTechs.length > 0 ? (
        <>
          <LabeledDiv
            label={
              <FormattedMessage
                id="sngfoO"
                description="Label for a section listing returned techs."
                defaultMessage="Returned {count, plural, one {Tech} other {Techs}}"
                values={{ count: returnedTechs.length }}
              />
            }
          >
            {returnedTechs.map((tech) => {
              return (
                <TechRow
                  key={tech}
                  techId={tech}
                  removeTech={() => {
                    researchedTech.forEach((techId) => {
                      dataUpdate(Events.RemoveTechEvent(factionId, techId));
                    });
                    dataUpdate(Events.AddTechEvent(factionId, tech));
                  }}
                />
              );
            })}
          </LabeledDiv>
          <TechResearchSection factionId={factionId} />
        </>
      ) : (
        <TechSelectHoverMenu
          factionId={factionId}
          techs={canReturnTechs}
          label={intl.formatMessage({
            id: "XG4lKH",
            description: "Label on a hover menu used to return a tech.",
            defaultMessage: "Return Tech",
          })}
          selectTech={(tech) =>
            dataUpdate(Events.RemoveTechEvent(factionId, tech.id))
          }
        />
      )}
    </div>
  );
}
