"use client";

import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CSSProperties, PropsWithChildren, useRef, useState } from "react";
import { SymbolX } from "../../icons/svgs";
import { em, rem } from "../../util/util";
import Circle from "../Circle/Circle";
import styles from "./LangSelectHoverMenu.module.scss";

interface FactionSelectProps {
  selectedLocale?: string;
  locales: string[];
  fadedLocales?: string[];
  invalidLocales?: string[];
  size?: number;
}

function LanguageIcon({ locale }: { locale: string }) {
  return (
    <Image
      src={`/images/flags/${locale}.png`}
      alt={`${locale} language select`}
      fill
      sizes={rem(128)}
      style={{ objectFit: "contain", pointerEvents: "none" }}
    />
  );
}

interface LanguageSelectCSS extends CSSProperties {
  "--opacity": number;
}

export default function LangSelectHoverMenu({
  selectedLocale = "en",
  locales,
  fadedLocales = [],
  invalidLocales = [],
  size = 44,
}: PropsWithChildren<FactionSelectProps>) {
  const pathName = usePathname();
  const menu = useRef<HTMLDivElement>(null);
  const innerMenu = useRef<HTMLDivElement>(null);
  const [closing, setClosing] = useState(false);

  if (locales.length === 1) {
    return null;
  }

  const hoverMenuStyle: CSSProperties = {
    left: 0,
    borderRadius: em(size / 2),
    border: `var(--border-size) solid var(--interactive-bg)`,
  };

  return (
    <div
      className={`hoverParent largeFont`}
      onMouseEnter={() => {
        if (!menu.current || closing) {
          return;
        }
        menu.current.classList.add("hover");
      }}
      onMouseLeave={() => {
        if (!menu.current) {
          return;
        }
        menu.current.classList.remove("hover");
      }}
      ref={menu}
    >
      <Circle
        backgroundColor="var(--background-color)"
        borderColor="var(--interactive-bg)"
        size={size}
      >
        <LanguageIcon locale={selectedLocale} />
      </Circle>
      <div
        className={`flexColumn hoverRadio down ${styles.hoverMenu}`}
        style={hoverMenuStyle}
        ref={innerMenu}
      >
        <div
          className="flexRow"
          style={{
            position: "relative",
            width: `calc(${em(size)} - 4px)`,
            height: `calc(${em(size)} - 4px)`,
          }}
        >
          <div
            className="flexRow"
            style={{
              position: "relative",
              width: em(size - 10),
              height: em(size - 10),
            }}
          >
            <LanguageIcon locale={selectedLocale} />
          </div>
        </div>
        {locales.map((locale) => {
          const isInvalid = invalidLocales.includes(locale);
          const opacity =
            (fadedLocales.includes(locale) && locale !== selectedLocale) ||
            isInvalid
              ? 0.2
              : 1;
          const languageSelectStyle: LanguageSelectCSS = {
            "--opacity": opacity,
            width: `calc(${em(size)} - 4px)`,
            height: `calc(${em(size)} - 4px)`,
            pointerEvents: isInvalid ? "none" : undefined,
          };
          if (locale === selectedLocale) {
            return null;
          }
          const updated = pathName.split("/");
          updated[1] = locale;
          const newPathName = updated.join("/");
          return (
            <Link
              key={locale}
              href={newPathName}
              className={`flexRow ${styles.oldFactionSelect}`}
              style={languageSelectStyle}
              onNavigate={() => {
                Cookies.set("TI_LOCALE", locale);
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: em(size - 10),
                  height: em(size - 10),
                }}
              >
                {locale === selectedLocale && !isInvalid ? (
                  <SymbolX />
                ) : (
                  <LanguageIcon locale={locale} />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
