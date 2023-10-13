import { useRef, useState } from "react";
import { useBetween } from "use-between";
import { useInterval } from "../util/util";

function makeid(length: number) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

const useTimer = () => {
  const [paused, setPaused] = useState(false);

  const savedCallbacks = useRef<Record<string, () => void>>({});

  useInterval(updateSubscribers, paused ? null : 1000);

  function addSubscriber(subscriber: () => void) {
    let id = makeid(12);
    while (savedCallbacks.current[id]) {
      id = makeid(12);
    }
    savedCallbacks.current[id] = subscriber;
    return id;
  }

  function removeSubscriber(id: string) {
    delete savedCallbacks.current[id];
  }

  function updateSubscribers() {
    for (const subscriber of Object.values(savedCallbacks.current)) {
      subscriber();
    }
  }

  return {
    paused,
    setPaused,
    addSubscriber,
    removeSubscriber,
  };
};

export const useSharedTimer = () => useBetween(useTimer);
