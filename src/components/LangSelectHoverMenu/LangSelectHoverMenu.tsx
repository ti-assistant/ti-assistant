"use client";

import Cookies from "js-cookie";
import Image from "next/image";
import { CSSProperties, PropsWithChildren, useRef, useState } from "react";
import { SymbolX } from "../../icons/svgs";
import { rem } from "../../util/util";
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
      src={`/images/${locale}-flag.png`}
      alt={`${locale} language select`}
      fill
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
  const menu = useRef<HTMLDivElement>(null);
  const innerMenu = useRef<HTMLDivElement>(null);
  const [closing, setClosing] = useState(false);

  if (locales.length === 1) {
    return null;
  }

  function closeFn() {
    if (!menu.current) {
      return;
    }
    menu.current.classList.remove("hover");
    setClosing(true);
    setTimeout(() => setClosing(false), 200);
  }

  const hoverMenuStyle: CSSProperties = {
    left: 0,
    borderRadius: rem(size / 2),
    border: `${"2px"} solid #444`,
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
      <Circle borderColor="#444" size={size}>
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
            width: `calc(${rem(size)} - 4px)`,
            height: `calc(${rem(size)} - 4px)`,
            fontSize: rem(size - 8),
            color: "#777",
          }}
        >
          <div
            className="flexRow"
            style={{
              position: "relative",
              width: rem(size - 10),
              height: rem(size - 10),
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
            width: `calc(${rem(size)} - 4px)`,
            height: `calc(${rem(size)} - 4px)`,
            pointerEvents: isInvalid ? "none" : undefined,
          };
          if (locale === selectedLocale) {
            return null;
          }
          return (
            <div
              key={locale}
              className={`flexRow ${styles.oldFactionSelect}`}
              style={languageSelectStyle}
              onClick={() => {
                closeFn();
                if (locale === selectedLocale) {
                  return;
                }
                Cookies.set("TI_LOCALE", locale);
                window.location.reload();
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: rem(size - 10),
                  height: rem(size - 10),
                }}
              >
                {locale === selectedLocale && !isInvalid ? (
                  <SymbolX />
                ) : (
                  <LanguageIcon locale={locale} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
