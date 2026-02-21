"use client";

import Cookies from "js-cookie";
import { PropsWithChildren, useState } from "react";
import { IntlProvider } from "react-intl";
import { SettingsContext } from "../../src/context/contexts";
import { Settings } from "../../src/util/settings";

export default function Wrapper({
  messages,
  locale,
  children,
}: PropsWithChildren<{ messages: Record<string, string>; locale: string }>) {
  return (
    <IntlProvider
      locale={locale}
      messages={messages}
      onError={(err) => {
        if (err.code === "MISSING_TRANSLATION") {
          return;
        }
        console.log(err);
      }}
    >
      {children}
    </IntlProvider>
  );
}

export function SettingsProvider({
  children,
  initialSettings,
}: PropsWithChildren<{
  initialSettings: Settings;
}>) {
  const [settings, setSettings] = useState(initialSettings);

  function updateSetting<T extends keyof Settings>(
    setting: T,
    value: Settings[T],
  ) {
    setSettings((settings) => {
      const newSettings: Settings = {
        ...settings,
        [setting]: value,
      };
      Cookies.set("settings", JSON.stringify(newSettings));
      return newSettings;
    });
  }

  function overwriteSettings(settings: Settings) {
    setSettings(settings);
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSetting,
        overwriteSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
