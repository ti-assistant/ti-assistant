import { cookies } from "next/headers";
import Link from "next/link";
import NonGameHeader from "../../src/components/NonGameHeader/NonGameHeader";
import { getIntl } from "../../src/util/server";
import { rem } from "../../src/util/util";
import styles from "./home-page.module.scss";
import JoinGame from "./JoinGame";
import SupportSection from "./SupportSection";

export default async function Page({ params }: PageProps<"/[locale]">) {
  const prevGameId = (await cookies()).get("gameid")?.value;

  const { locale } = await params;

  const intl = await getIntl(locale);

  return (
    <>
      <div className="flexColumn" style={{ gap: "1rem" }}>
        <NonGameHeader leftSidebar="TI ASSISTANT" rightSidebar="TI ASSISTANT" />
        <div className={styles.CenterColumn}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "stretch",
              gap: "0.5rem",
            }}
          >
            <Link
              href={"/setup"}
              className="primary"
              style={{ fontSize: rem(44), lineHeight: 1 }}
            >
              {intl.formatMessage({
                id: "+HPhsr",
                defaultMessage: "New Game",
                description: "A button that will start a new game.",
              })}
            </Link>
            {prevGameId ? (
              <Link
                href={`/game/${prevGameId}`}
                className="outline"
                style={{ fontSize: "2rem" }}
              >
                {intl.formatMessage({
                  id: "+/Qpw/",
                  defaultMessage: "Continue Game",
                  description: "A button that will rejoin the previous game.",
                })}
              </Link>
            ) : null}
            <JoinGame />
          </div>
          <div className={styles.OtherLinks}>
            <Link href={"/archive"} className="outline">
              {intl.formatMessage({
                id: "zOtJ5A",
                defaultMessage: "Archive",
                description: "A button that will open the archive page.",
              })}
            </Link>
            <Link href={"/stats"} className="outline">
              {intl.formatMessage({
                id: "aO0PYJ",
                defaultMessage: "Stats",
                description: "A button that will open the statistics page.",
              })}
            </Link>
            <Link href={"/map-builder"} className="outline">
              {intl.formatMessage({
                id: "OAXWRP",
                defaultMessage: "Map Builder",
                description: "A button that will open the map builder.",
              })}
            </Link>
            <Link href={`/supporters`} className="outline">
              {intl.formatMessage({
                id: "4Z//RZ",
                defaultMessage: "Supporters",
                description: "A button that will open the supporters page.",
              })}
            </Link>
          </div>
          <SupportSection intl={intl} />
        </div>
        <div
          className="flexColumn"
          style={{
            position: "absolute",
            bottom: rem(8),
            fontSize: rem(10),
            textAlign: "center",
            gap: rem(4),
          }}
        >
          <div>
            Twilight Imperium Assistant is not affiliated with{" "}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://www.fantasyflightgames.com/en/index/"
            >
              Fantasy&nbsp;Flight&nbsp;Games®
            </a>
          </div>
          <div>
            Twilight Imperium™ and all associated images are the property of{" "}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://www.fantasyflightgames.com/en/index/"
            >
              Fantasy&nbsp;Flight&nbsp;Games®
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
