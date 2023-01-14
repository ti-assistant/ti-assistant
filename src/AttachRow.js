import Image from 'next/image';
import { useRouter } from 'next/router';
import { useRef } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { LabeledDiv } from './LabeledDiv';
import { PlanetAttributes } from './PlanetRow';
import { ResponsiveResources } from './Resources';
import { useSharedUpdateTimes } from './Updater';
import { attachToPlanet, removeFromPlanet } from './util/api/attachments';
import { fetcher } from './util/api/util';
import { responsivePixels } from './util/util';

import { Resources } from "/src/Resources.js";

function LegendaryPlanetIcon() {
  return (
    <div style={{display: "flex", alignItems: "flex-start", borderRadius: "22px", height: "18px", width: "18px", paddingTop: "3px", paddingLeft: "3px", boxShadow: "0px 0px 2px 1px purple", backgroundColor: "black"}}>
      <Image src="/images/legendary_planet.svg" alt="Legendary Planet Icon" width="15px" height="15px" />
    </div>);
}


export function AttachRow({ attachment, currentPlanet }) {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { game: gameid, faction: playerFaction } = router.query;
  const { data: attachments, error: attachmentsError } = useSWR(gameid ? `/api/${gameid}/attachments` : null, fetcher);
  const { data: options, error: optionsError } = useSWR(gameid ? `/api/${gameid}/options` : null, fetcher);
  


  function isSkip() {
    return attachment.attribute.includes("skip");
  }
  function hasResourcesOrInfluence() {
    return attachment.resources !== 0 || attachment.influence !== 0;
  }
  function hasAttribute() {
    return attachment.attribute !== "";
  }
  function getAttributeIcon(width, height) {
    switch (attachment.attribute) {
      case "legendary":
        return <LegendaryPlanetIcon />;
      case "red-skip":
        return <Image src="/images/red_tech.webp" alt="Red Tech Skip" width={width} height={height} />;
      case "yellow-skip":
        return <Image src="/images/yellow_tech.webp" alt="Yellow Tech Skip" width={width} height={height} />;
      case "blue-skip":
        return <Image src="/images/blue_tech.webp" alt="Blue Tech Skip" width={width} height={height} />;
      case "green-skip":
        return <Image src="/images/green_tech.webp" alt="Blue Tech Skip" width={width} height={height} />;
      case "demilitarized":
        return <Image src="/images/demilitarized_zone.svg" alt="Demilitarized Zone" width={width} height={height} />;
      case "tomb":
        return <Image src="/images/tomb_symbol.webp" alt="Tomb of Emphidia" width={width} height={height} />;
      case "all-types":
        return <div>
          <Image src="/images/industrial_icon.svg" alt="Industrial Planet Icon" width={width} height={height} />
          <Image src="/images/cultural_icon.svg" alt="Cultural Planet Icon" width={width} height={height} />
          <Image src="/images/hazardous_icon.svg" alt="Hazardous Planet Icon" width={width} height={height} />
        </div>
      case "space-cannon":
        return <div style={{width: "22px", height: "22px"}}>✹✹✹</div>
      default:
        return null;
    }
  }
  let attached = null;
  (attachment.planets ?? []).forEach((planet) => {
    if (planet !== currentPlanet) {
      if (attached === null) {
        attached = planet;
      } else {
        attached = "Multiple Planets";
      }
    }
  });

  function toggleAttachment() {
    if (attachment.planets.includes(currentPlanet)) {
      removeFromPlanet(mutate, gameid, attachments, currentPlanet, attachment.name);
    } else {
      attachToPlanet(mutate, gameid, attachments, currentPlanet, attachment.name, options);
    }
  }

  return (
    <div className="flexRow" style={{width: "100%", height: responsivePixels(72), justifyContent: "flex-start", fontSize: responsivePixels(14), position: "relative", gap: responsivePixels(4), whiteSpace: "nowrap"}}>
      <div style={{flexBasis: "60%"}}>
        <button style={{fontSize: responsivePixels(14)}} onClick={toggleAttachment} className={attachment.planets.includes(currentPlanet) ? "selected" : ""}>{attachment.name}</button>
      </div>
      <ResponsiveResources resources={attachment.resources} influence={attachment.influence} />
      {isSkip() ? <div style={{marginRight: responsivePixels(6)}}>OR</div> : null}
      {hasAttribute() ? <PlanetAttributes attributes={[attachment.attribute]} /> : null}
      {/* {hasAttribute() ? getAttributeIcon("22px", "22px") : null} */}
      {attached ? 
        <div style={{fontFamily: "Myriad Pro",
        position: "absolute",
        color: "indianred",
        borderRadius: responsivePixels(5),
        border: `${responsivePixels(1)} solid indianred`,
        padding: `0 ${responsivePixels(4)}`,
        fontSize: responsivePixels(12),
        bottom: responsivePixels(2),
      }}>Attached to {attached}</div> : null
      }
    </div>
  );
}
