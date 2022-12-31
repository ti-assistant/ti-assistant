import { useRouter } from 'next/router'
import useSWR, { useSWRConfig } from 'swr'

import { fetcher, poster } from './util/api/util'
import { setSpeaker } from './util/api/state';
import { Modal } from "/src/Modal.js";
import { BasicFactionTile } from './FactionTile';
import { revealObjective } from './util/api/objectives';
import { ObjectiveRow } from './ObjectiveRow';
import { useSharedUpdateTimes } from './Updater';
import { useRef } from 'react';

function typeToText(type) {
  switch (type) {
    case "stage-one":
      return "Stage One";
    case "stage-two":
      return "Stage Two";
    case "secret":
      return "Secret";
    case "other":
      return "Other";
  }
  return "None";
}

export function ObjectiveModal({ type, visible, onComplete }) {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { mutate } = useSWRConfig();
  const { data: objectives, objectivesError } = useSWR(gameid ? `/api/${gameid}/objectives` : null, fetcher);
  


  if (objectivesError) {
    return (<div>Failed to load objectives</div>);
  }
  if (!objectives) {
    return (<div>Loading...</div>);
  }

  function selectObjective(objectiveName) {
    revealObjective(mutate, gameid, objectives, null, objectiveName);
    onComplete(objectiveName);
  }

  const orderedObjectives = Object.values(objectives).filter((objective) => {
    return objective.type === type
      && !objective.selected;
  }).sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    return 1;
  })

  return (
  <Modal closeMenu={() => onComplete(null)} visible={visible} title={`Reveal ${typeToText(type)} Objective`}
    content={
      <div className="flexColumn" style={{alignItems: "flex-start"}}>
        {orderedObjectives.map((objective) => {
          return (
            <ObjectiveRow key={objective.name} objective={objective} addObjective={() => selectObjective(objective.name)} viewing={true} />
          );
        })}
      </div>
  } />
  );
}