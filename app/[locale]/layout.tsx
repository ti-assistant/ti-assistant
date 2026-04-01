import { Metadata, Viewport } from "next";
import { CSSProperties, Suspense } from "react";
import "../../public/site.css";
import { getMessages } from "../../src/util/server";
import { Optional } from "../../src/util/types/types";
import { InnerLayout, LoadingLayout } from "./inner-layout";
import { getTheme } from "../../src/util/theme";
import { Mulish } from "next/font/google";

const mulish = Mulish({
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Twilight Imperium Assistant",
  description:
    "Help your Twilight Imperium 4 games run more smoothly with TI Assistant, a fully featured assistant application that can be used by any number of players on their phone and on a shared screen.",
  icons: {
    shortcut: "/images/favicon.ico",
  },
};

export const viewport: Viewport = {
  colorScheme: "dark light",
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
    { locale: "pt-BR" },
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
    case "pl":
    case "ru":
      fontSwitchStyle = {
        "--main-font": "Russo One",
      };
      break;
  }

  return (
    <html lang={locale} className={mulish.className}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: getTheme }} />
      </head>
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
