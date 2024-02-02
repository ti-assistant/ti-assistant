"use client";

import { IntlProvider } from "react-intl";
import { PropsWithChildren } from "react";

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
