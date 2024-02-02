"use client";

import React, { CSSProperties, ReactNode, useRef, useState } from "react";
import { SymbolX } from "../../icons/svgs";
import { responsivePixels } from "../../util/util";
import styles from "./LanguageSelectRadialMenu.module.scss";
import Circle from "../Circle/Circle";
import Image from "next/image";
import Cookies from "js-cookie";

interface LanguageSelectRadialMenuProps {
  selectedLocale?: string;
  locales: string[];
  fadedLocales?: string[];
  invalidLocales?: string[];
  size?: number;
  tag?: ReactNode;
  borderColor?: string;
  tagBorderColor?: string;
}

function getRadialPosition(index: number, numOptions: number, size: number) {
  const radians = ((Math.PI * 2) / numOptions) * index;

  const center = (size * 3) / 2;
  const pos = {
    "--y-pos": responsivePixels(
      center - size * Math.cos(radians) - size / 2 + 2
    ),
    "--x-pos": responsivePixels(
      center - size * -Math.sin(radians) - size / 2 + 2
    ),
    "--initial-y": responsivePixels(size + 2),
    "--initial-x": responsivePixels(size + 2),
  };
  return pos;
}

interface LanguageSelectRadialMenuCSS extends CSSProperties {
  "--border-color": string;
  "--size": string;
}

interface LanguageSelectCSS extends CSSProperties {
  "--opacity": number;
  "--x-pos": string;
  "--y-pos": string;
  "--initial-x": string;
  "--initial-y": string;
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

export default function LanguageSelectRadialMenu({
  selectedLocale = "en",
  locales,
  fadedLocales = [],
  invalidLocales = [],
  size = 44,
  tag,
  borderColor = "#444",
  tagBorderColor = "#444",
}: LanguageSelectRadialMenuProps) {
  const menu = useRef<HTMLDivElement>(null);
  const innerMenu = useRef<HTMLDivElement>(null);
  const [closing, setClosing] = useState(false);

  if (locales.length === 1) {
    return null;
  }

  function closeFn() {
    if (!menu.current || !styles.hover) {
      return;
    }
    menu.current.classList.remove(styles.hover);
    setClosing(true);
    setTimeout(() => setClosing(false), 200);
  }

  const hoverParentStyle: LanguageSelectRadialMenuCSS = {
    "--border-color": borderColor,
    "--size": responsivePixels(size),
  };

  return (
    <div
      className={styles.hoverParent}
      style={hoverParentStyle}
      onMouseEnter={() => {
        if (!menu.current || closing || !styles.hover) {
          return;
        }
        menu.current.classList.add(styles.hover);
      }}
      onMouseLeave={() => {
        if (!menu.current || !styles.hover) {
          return;
        }
        menu.current.classList.remove(styles.hover);
      }}
      ref={menu}
    >
      {locales.length > 0 ? (
        <React.Fragment>
          <div className={styles.hoverBackground}></div>
          <div className={`flexRow ${styles.hoverRadial}`} ref={innerMenu}>
            {locales.map((locale, index) => {
              const isInvalid = invalidLocales.includes(locale);
              const opacity =
                (fadedLocales.includes(locale) && locale !== selectedLocale) ||
                isInvalid
                  ? 0.2
                  : 1;
              const languageSelectStyle: LanguageSelectCSS = {
                "--opacity": opacity,
                width: responsivePixels(size - 4),
                height: responsivePixels(size - 4),
                pointerEvents: isInvalid ? "none" : undefined,
                ...getRadialPosition(index, locales.length, size),
              };
              return (
                <div
                  key={locale}
                  className={`flexRow ${styles.factionSelect}`}
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
                      width: responsivePixels(size - 10),
                      height: responsivePixels(size - 10),
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
            <div
              className={`flexRow ${styles.centerCircle}`}
              style={{
                width: responsivePixels(size - 2),
                height: responsivePixels(size - 2),
              }}
            >
              <div
                className="flexRow"
                style={{
                  width: responsivePixels(size - 4),
                  height: responsivePixels(size - 4),
                  fontSize: responsivePixels(size - 8),
                }}
              >
                <div
                  className="flexRow"
                  style={{
                    position: "relative",
                    width: responsivePixels(size - 10),
                    height: responsivePixels(size - 10),
                  }}
                >
                  {selectedLocale ? (
                    <LanguageIcon locale={selectedLocale} />
                  ) : (
                    <SymbolX />
                  )}
                </div>

                {tag ? (
                  <div
                    className={`flexRow ${styles.tag}`}
                    style={{
                      border: `${responsivePixels(1)} solid ${tagBorderColor}`,
                      boxShadow: `${responsivePixels(1)} ${responsivePixels(
                        1
                      )} ${responsivePixels(4)} black`,
                      width: responsivePixels(24),
                      height: responsivePixels(24),
                    }}
                  >
                    {tag}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </React.Fragment>
      ) : null}
      <Circle
        borderColor={borderColor}
        tag={tag}
        tagBorderColor={tagBorderColor}
        size={size}
      >
        <LanguageIcon locale={selectedLocale} />
      </Circle>
    </div>
  );
}
