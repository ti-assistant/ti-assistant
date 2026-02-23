"use client";

import { useEffect } from "react";

export default function ServiceWorkerWrapper() {
  useEffect(() => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) =>
        console.log(
          "Service Worker registration successful with scope: ",
          registration.scope,
        ),
      )
      .catch((err) => console.log("Service Worker registration failed: ", err));
  }, []);
  return null;
}
