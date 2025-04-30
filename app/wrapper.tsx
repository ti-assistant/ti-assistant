"use client";

import { IntlProvider } from "react-intl";
import { PropsWithChildren, useState } from "react";
import { SettingsContext } from "../src/context/contexts";
import { Settings } from "../src/util/settings";
import Cookies from "js-cookie";

export default function Wrapper({
  messages,
  locale,
  children,
}: PropsWithChildren<{ messages: Record<string, string>; locale: string }>) {
  return (
    <IntlProvider locale={locale} messages={messages} onError={() => {}}>
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
    value: Settings[T]
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

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSetting,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
