import { Metadata, Viewport } from "next";
import { CSSProperties, Suspense } from "react";
import "../../public/site.css";
import { getMessages } from "../../src/util/server";
import { Optional } from "../../src/util/types/types";
import { InnerLayout, LoadingLayout } from "./inner-layout";

export const metadata: Metadata = {
  title: "Twilight Imperium Assistant",
  description:
    "Help your Twilight Imperium 4 games run more smoothly with TI Assistant, a fully featured assistant application that can be used by any number of players on their phone and on a shared screen.",
  icons: {
    shortcut: "/images/favicon.ico",
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
};

interface FontStyle extends CSSProperties {
  "--main-font": string;
}

export async function generateStaticParams() {
  return [
    { locale: "en" },
    { locale: "de" },
    { locale: "fr" },
    { locale: "ru" },
    { locale: "pl" },
  ];
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  const messagePromise = getMessages(locale);

  let fontSwitchStyle: Optional<FontStyle>;
  switch (locale) {
    case "ru":
      fontSwitchStyle = {
        "--main-font": "Russo One",
      };
      break;
    case "pl":
      fontSwitchStyle = {
        "--main-font": "Myriad Pro",
      };
      break;
  }

  return (
    <html lang={locale}>
      <body style={fontSwitchStyle}>
        <Suspense fallback={<LoadingLayout />}>
          <InnerLayout locale={locale} messagePromise={messagePromise}>
            {children}
          </InnerLayout>
        </Suspense>
      </body>
    </html>
  );
}
