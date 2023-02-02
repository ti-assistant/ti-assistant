import { useRouter } from 'next/router';
import { useSWRConfig } from 'swr';
import { PlanetAttributes } from './PlanetRow';
import { ResponsiveResources } from './Resources';
import { addAttachment, removeAttachment } from './util/api/planets';
import { responsivePixels } from './util/util';

export function AttachRow({ attachment, planet }) {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { game: gameid } = router.query;


  function isSkip() {
    return attachment.attribute.includes("skip");
  }
  function hasAttribute() {
    return attachment.attribute !== "";
  }
  // let attached = null;
  // Object.values(planets).forEach((otherPlanet) => {
  //   if ((otherPlanet.attachments ?? []).includes(attachment.name) && otherPlanet.name !== planet.name) {
  //     if (attached === null) {
  //       attached = otherPlanet.name;
  //     } else {
  //       attached = "Multiple Planets";
  //     }
  //   }
  // })

  function toggleAttachment() {
    if ((planet.attachments ?? []).includes(attachment.name)) {
      removeAttachment(mutate, gameid, planet.name, attachment.name)
    } else {
      addAttachment(mutate, gameid, planet.name, attachment.name);
    }
  }

  return (
    <div className="flexRow" style={{width: "100%", height: responsivePixels(72), justifyContent: "flex-start", fontSize: responsivePixels(14), position: "relative", gap: responsivePixels(4), whiteSpace: "nowrap"}}>
      <div style={{flexBasis: "60%"}}>
        <button style={{fontSize: responsivePixels(14)}} onClick={toggleAttachment} className={planet.attachments.includes(attachment.name) ? "selected" : ""}>{attachment.name}</button>
      </div>
      <ResponsiveResources resources={attachment.resources} influence={attachment.influence} />
      {isSkip() ? <div style={{marginRight: responsivePixels(6)}}>OR</div> : null}
      {hasAttribute() ? <PlanetAttributes attributes={[attachment.attribute]} /> : null}
      {/* {hasAttribute() ? getAttributeIcon("22px", "22px") : null} */}
      {/* {attached ? 
        <div style={{fontFamily: "Myriad Pro",
        position: "absolute",
        color: "indianred",
        borderRadius: responsivePixels(5),
        border: `${responsivePixels(1)} solid indianred`,
        padding: `0 ${responsivePixels(4)}`,
        fontSize: responsivePixels(12),
        bottom: responsivePixels(2),
      }}>Attached to {attached}</div> : null
      } */}
    </div>
  );
}
