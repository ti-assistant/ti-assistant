"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CSSProperties, PropsWithChildren, useRef, useState } from "react";
import { SymbolX } from "../../icons/svgs";
import { rem } from "../../util/util";
import Circle from "../Circle/Circle";
import styles from "./LangSelectHoverMenu.module.scss";
import Cookies from "js-cookie";

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
    border: `var(--border-size) solid var(--neutral-border)`,
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
      <Circle borderColor="var(--neutral-border)" size={size}>
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
            </Link>
          );
        })}
      </div>
    </div>
  );
}
