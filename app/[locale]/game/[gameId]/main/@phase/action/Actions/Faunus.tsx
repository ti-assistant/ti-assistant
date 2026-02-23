import { FormattedMessage, useIntl } from "react-intl";
import ClaimPlanetsSection from "../../../../../../../../src/components/ClaimPlanetsSection/ClaimPlanetsSection";
import FormattedDescription from "../../../../../../../../src/components/FormattedDescription/FormattedDescription";
import LabeledDiv from "../../../../../../../../src/components/LabeledDiv/LabeledDiv";
import { usePlanets } from "../../../../../../../../src/context/dataHooks";
import { InfoRow } from "../../../../../../../../src/InfoRow";

export default function Faunus({ factionId }: { factionId: FactionId }) {
  const intl = useIntl();
  const planets = usePlanets();

  const faunus = planets["Faunus"];

  if (!faunus || faunus.owner !== factionId) {
    return null;
  }

  const availablePlanets = Object.values(planets).filter((planet) => {
    return (
      !planet.home &&
      !planet.attributes.includes("legendary") &&
      (planet.attachments ?? []).length === 0
    );
  });
  availablePlanets.sort((a, b) => (a.name > b.name ? 1 : -1));

  return (
    <LabeledDiv
      label={
        <InfoRow
          infoTitle={
            <FormattedMessage
              id="Planets.Faunus.Name"
              description="Name of Planet: Faunus"
              defaultMessage="Faunus"
            />
          }
          infoContent={
            <FormattedDescription
              description={intl.formatMessage(
                {
                  id: "Planets.Faunus.Ability",
                  description: "Planet Ability for Faunus",
                  defaultMessage:
                    "You may exhaust this card when you pass to gain control of a non-home, non-legendary planet that contains no units and has no attachments.",
                },
                { br: "\n\n" },
              )}
            />
          }
        >
          <FormattedMessage
            id="Planets.Faunus.Name"
            description="Name of Planet: Faunus"
            defaultMessage="Faunus"
          />
        </InfoRow>
      }
    >
      <ClaimPlanetsSection
        factionId={factionId}
        numPlanets={1}
        availablePlanets={availablePlanets}
        hideWrapper
      />
    </LabeledDiv>
  );
}
