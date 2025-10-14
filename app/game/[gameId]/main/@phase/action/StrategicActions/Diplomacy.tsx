import { CSSProperties } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import GainRelic from "../../../../../../../src/components/Actions/GainRelic";
import AttachmentSelectRadialMenu from "../../../../../../../src/components/AttachmentSelectRadialMenu/AttachmentSelectRadialMenu";
import LabeledDiv from "../../../../../../../src/components/LabeledDiv/LabeledDiv";
import PlanetIcon from "../../../../../../../src/components/PlanetIcon/PlanetIcon";
import PlanetRow from "../../../../../../../src/components/PlanetRow/PlanetRow";
import {
  useAttachments,
  useCurrentTurn,
  useGameId,
  usePlanets,
  useViewOnly,
} from "../../../../../../../src/context/dataHooks";
import {
  useFaction,
  useFactions,
} from "../../../../../../../src/context/factionDataHooks";
import {
  addAttachmentAsync,
  claimPlanetAsync,
  removeAttachmentAsync,
  unclaimPlanetAsync,
} from "../../../../../../../src/dynamic/api";
import { ClientOnlyHoverMenu } from "../../../../../../../src/HoverMenu";
import {
  getAttachments,
  getClaimedPlanets,
} from "../../../../../../../src/util/actionLog";
import {
  getFactionColor,
  getFactionName,
} from "../../../../../../../src/util/factions";
import { applyPlanetAttachments } from "../../../../../../../src/util/planets";
import { rem } from "../../../../../../../src/util/util";

const Diplomacy = {
  Primary,
  Secondary,
  AllSecondaries,
};

export default Diplomacy;

function Primary({ factionId }: { factionId: FactionId }) {
  const attachments = useAttachments();
  const currentTurn = useCurrentTurn();
  const gameId = useGameId();
  const planets = usePlanets();
  const viewOnly = useViewOnly();
  if (factionId !== "Xxcha Kingdom") {
    return null;
  }

  const xxchaPlanets = getClaimedPlanets(currentTurn, "Xxcha Kingdom");

  const peaceAccordsPlanets = Object.values(planets)
    .filter((planet) => {
      if (planet.locked) {
        return false;
      }
      if (planet.id === "Mecatol Rex") {
        return false;
      }
      if (planet.attributes.includes("ocean")) {
        return false;
      }
      return true;
    })
    .sort((a, b) => (a.name > b.name ? 1 : -1));

  const targetButtonStyle: CSSProperties = {
    fontFamily: "Myriad Pro",
    padding: rem(8),
    display: "grid",
    gridAutoFlow: "column",
    gridTemplateRows: `repeat(${Math.min(
      12,
      peaceAccordsPlanets.length
    )}, auto)`,
    gap: rem(4),
    justifyContent: "flex-start",
    overflowX: "auto",
    maxWidth: "85vw",
  };
  return (
    <LabeledDiv
      label={
        <FormattedMessage
          id="Xxcha Kingdom.Abilities.Peace Accords.Title"
          defaultMessage="Peace Accords"
          description="Title of Faction Ability: Peace Accords"
        />
      }
      blur
    >
      <>
        {xxchaPlanets.length > 0 ? (
          <div
            className="flexColumn"
            style={{ alignItems: "stretch", width: "100%" }}
          >
            {xxchaPlanets.map((planet) => {
              const planetObj = planets[planet.planet];
              if (!planetObj) {
                return null;
              }
              const adjustedPlanet = applyPlanetAttachments(
                planetObj,
                attachments ?? {}
              );
              const currentAttachment = getAttachments(
                currentTurn,
                planet.planet
              )[0];
              const claimedAttachments = new Set<AttachmentId>();
              for (const planet of Object.values(planets)) {
                for (const attachment of planet.attachments ?? []) {
                  claimedAttachments.add(attachment);
                }
              }
              const availableAttachments = Object.values(attachments)
                .filter(
                  (attachment) =>
                    attachment.required.type &&
                    adjustedPlanet.types.includes(attachment.required.type) &&
                    (attachment.id === currentAttachment ||
                      !claimedAttachments.has(attachment.id))
                )
                .map((attachment) => attachment.id);
              return (
                <div
                  key={planet.planet}
                  className="flexColumn"
                  style={{
                    width: "100%",
                    gap: 0,
                    justifyItems: "flex-start",
                    alignItems: "flex-start",
                  }}
                >
                  <div className="flexRow" style={{ width: "100%" }}>
                    <div style={{ width: "100%" }}>
                      <PlanetRow
                        factionId={"Xxcha Kingdom"}
                        planet={adjustedPlanet}
                        removePlanet={() => {
                          unclaimPlanetAsync(
                            gameId,
                            "Xxcha Kingdom",
                            planet.planet
                          );
                        }}
                        opts={{
                          hideAttachButton: true,
                        }}
                      />
                    </div>
                    {availableAttachments.length > 0 && !planet.prevOwner ? (
                      <div
                        className="flexRow"
                        style={{ justifyContent: "center" }}
                      >
                        <AttachmentSelectRadialMenu
                          attachments={availableAttachments}
                          hasSkip={adjustedPlanet.attributes.reduce(
                            (hasSkip, attribute) => {
                              if (attribute.includes("skip")) {
                                if (
                                  currentAttachment &&
                                  attachments[currentAttachment]?.attribute ===
                                    attribute
                                ) {
                                  return planetObj.attributes.reduce(
                                    (hasSkip, attribute) => {
                                      if (attribute.includes("skip")) {
                                        return true;
                                      }
                                      return hasSkip;
                                    },
                                    false
                                  );
                                }
                                return true;
                              }
                              return hasSkip;
                            },
                            false
                          )}
                          onSelect={(attachmentId, prevAttachment) => {
                            if (prevAttachment) {
                              removeAttachmentAsync(
                                gameId,
                                planet.planet,
                                prevAttachment
                              );
                            }
                            if (attachmentId) {
                              addAttachmentAsync(
                                gameId,
                                planet.planet,
                                attachmentId
                              );
                            }
                          }}
                          selectedAttachment={currentAttachment}
                          tag={
                            <PlanetIcon
                              types={adjustedPlanet.types}
                              size="75%"
                            />
                          }
                        />
                      </div>
                    ) : null}
                  </div>
                  {!planet.prevOwner &&
                  adjustedPlanet.attributes.includes("relic") ? (
                    <div style={{ marginLeft: rem(16) }}>
                      <GainRelic
                        factionId={factionId}
                        planetId={planet.planet}
                      />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : null}
        {peaceAccordsPlanets.length > 0 && xxchaPlanets.length === 0 ? (
          <ClientOnlyHoverMenu
            label={
              <FormattedMessage
                id="UJs3kj"
                description="Text on a hover menu for claiming an empty planet."
                defaultMessage="Claim Empty Planet"
              />
            }
          >
            <div className="flexRow" style={targetButtonStyle}>
              {peaceAccordsPlanets.map((planet) => {
                return (
                  <button
                    key={planet.id}
                    style={{
                      minWidth:
                        peaceAccordsPlanets.length > 50 ? rem(72) : rem(90),
                      fontSize:
                        peaceAccordsPlanets.length > 50 ? rem(14) : undefined,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    onClick={() =>
                      claimPlanetAsync(gameId, factionId, planet.id)
                    }
                    disabled={viewOnly}
                  >
                    {planet.name}
                  </button>
                );
              })}
            </div>
          </ClientOnlyHoverMenu>
        ) : null}
      </>
    </LabeledDiv>
  );
}

function Secondary({ factionId }: { factionId: FactionId }) {
  const attachments = useAttachments();
  const currentTurn = useCurrentTurn();
  const faction = useFaction(factionId);
  const gameId = useGameId();
  const intl = useIntl();
  const planets = usePlanets();
  const viewOnly = useViewOnly();

  if (factionId !== "Xxcha Kingdom") {
    return null;
  }

  const xxchaPlanets = getClaimedPlanets(currentTurn, "Xxcha Kingdom");

  const peaceAccordsPlanets = Object.values(planets)
    .filter((planet) => {
      if (planet.locked) {
        return false;
      }
      if (planet.id === "Mecatol Rex") {
        return false;
      }
      if (planet.attributes.includes("ocean")) {
        return false;
      }
      return true;
    })
    .sort((a, b) => (a.name > b.name ? 1 : -1));

  const targetButtonStyle: CSSProperties = {
    fontFamily: "Myriad Pro",
    padding: rem(8),
    display: "grid",
    gridAutoFlow: "column",
    gridTemplateRows: `repeat(${Math.min(
      12,
      peaceAccordsPlanets.length
    )}, auto)`,
    gap: rem(4),
    justifyContent: "flex-start",
    overflowX: "auto",
    maxWidth: "85vw",
  };

  return (
    <LabeledDiv
      label={`${getFactionName(faction)} - ${intl.formatMessage({
        id: "Xxcha Kingdom.Abilities.Peace Accords.Title",
        defaultMessage: "Peace Accords",
        description: "Title of Faction Ability: Peace Accords",
      })}
              `}
      color={getFactionColor(faction)}
      blur
    >
      <>
        {xxchaPlanets.length > 0 ? (
          <div
            className="flexColumn"
            style={{ alignItems: "stretch", width: "100%" }}
          >
            {xxchaPlanets.map((planet) => {
              const planetObj = planets[planet.planet];
              if (!planetObj) {
                return null;
              }
              const adjustedPlanet = applyPlanetAttachments(
                planetObj,
                attachments ?? {}
              );
              const currentAttachment = getAttachments(
                currentTurn,
                planet.planet
              )[0];
              const claimedAttachments = new Set<AttachmentId>();
              for (const planet of Object.values(planets)) {
                for (const attachment of planet.attachments ?? []) {
                  claimedAttachments.add(attachment);
                }
              }
              const availableAttachments = Object.values(attachments)
                .filter(
                  (attachment) =>
                    attachment.required.type &&
                    adjustedPlanet.types.includes(attachment.required.type) &&
                    (attachment.id === currentAttachment ||
                      !claimedAttachments.has(attachment.id))
                )
                .map((attachment) => attachment.id);
              return (
                <div
                  key={planet.planet}
                  className="flexColumn"
                  style={{
                    width: "100%",
                    gap: 0,
                    justifyItems: "flex-start",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    key={planet.planet}
                    className="flexRow"
                    style={{ width: "100%" }}
                  >
                    <div style={{ width: "100%" }}>
                      <PlanetRow
                        factionId={"Xxcha Kingdom"}
                        planet={adjustedPlanet}
                        removePlanet={() => {
                          unclaimPlanetAsync(
                            gameId,
                            "Xxcha Kingdom",
                            planet.planet
                          );
                        }}
                        opts={{ hideAttachButton: true }}
                      />
                    </div>
                    {availableAttachments.length > 0 && !planet.prevOwner ? (
                      <div
                        className="flexRow"
                        style={{ justifyContent: "center" }}
                      >
                        <AttachmentSelectRadialMenu
                          attachments={availableAttachments}
                          hasSkip={adjustedPlanet.attributes.reduce(
                            (hasSkip, attribute) => {
                              if (attribute.includes("skip")) {
                                if (
                                  currentAttachment &&
                                  attachments[currentAttachment]?.attribute ===
                                    attribute
                                ) {
                                  return planetObj.attributes.reduce(
                                    (hasSkip, attribute) => {
                                      if (attribute.includes("skip")) {
                                        return true;
                                      }
                                      return hasSkip;
                                    },
                                    false
                                  );
                                }
                                return true;
                              }
                              return hasSkip;
                            },
                            false
                          )}
                          onSelect={(attachmentId, prevAttachment) => {
                            if (prevAttachment) {
                              removeAttachmentAsync(
                                gameId,
                                planet.planet,
                                prevAttachment
                              );
                            }
                            if (attachmentId) {
                              addAttachmentAsync(
                                gameId,
                                planet.planet,
                                attachmentId
                              );
                            }
                          }}
                          selectedAttachment={currentAttachment}
                          tag={
                            <PlanetIcon
                              types={adjustedPlanet.types}
                              size="75%"
                            />
                          }
                        />
                      </div>
                    ) : null}
                  </div>
                  {/* TODO: Remove if rules specify whenever a planet changes hands. */}
                  {!planet.prevOwner &&
                  adjustedPlanet.attributes.includes("relic") ? (
                    <div style={{ marginLeft: rem(16) }}>
                      <GainRelic
                        factionId="Xxcha Kingdom"
                        planetId={planet.planet}
                      />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : null}
        {peaceAccordsPlanets.length > 0 && xxchaPlanets.length === 0 ? (
          <ClientOnlyHoverMenu
            label={
              <FormattedMessage
                id="UJs3kj"
                description="Text on a hover menu for claiming an empty planet."
                defaultMessage="Claim Empty Planet"
              />
            }
          >
            <div className="flexRow" style={targetButtonStyle}>
              {peaceAccordsPlanets.map((planet) => {
                return (
                  <button
                    key={planet.id}
                    style={{
                      minWidth:
                        peaceAccordsPlanets.length > 50 ? rem(72) : rem(90),
                      fontSize:
                        peaceAccordsPlanets.length > 50 ? rem(14) : undefined,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    onClick={() => {
                      claimPlanetAsync(gameId, "Xxcha Kingdom", planet.id);
                    }}
                    disabled={viewOnly}
                  >
                    {planet.name}
                  </button>
                );
              })}
            </div>
          </ClientOnlyHoverMenu>
        ) : null}
      </>
    </LabeledDiv>
  );
}

function AllSecondaries({ activeFactionId }: { activeFactionId: FactionId }) {
  const factions = useFactions();

  if (!factions["Xxcha Kingdom"] || activeFactionId === "Xxcha Kingdom") {
    return null;
  }

  return <Secondary factionId="Xxcha Kingdom" />;
}
