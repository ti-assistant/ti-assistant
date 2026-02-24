import { cookies } from "next/headers";
import Link from "next/link";
import BorderedDiv from "../../src/components/BorderedDiv/BorderedDiv";
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
    <div className="flexColumn" style={{ gap: "1rem" }}>
      <NonGameHeader leftSidebar="TI ASSISTANT" rightSidebar="TI ASSISTANT" />
      <div className={styles.CenterColumn}>
        <Link href={"/setup"}>
          <BorderedDiv style={{ alignItems: "center", fontSize: rem(44) }}>
            {intl.formatMessage({
              id: "+HPhsr",
              defaultMessage: "New Game",
              description: "A button that will start a new game.",
            })}
          </BorderedDiv>
        </Link>
        {prevGameId ? (
          <Link href={`/game/${prevGameId}`}>
            <BorderedDiv style={{ alignItems: "center", fontSize: "2rem" }}>
              {intl.formatMessage({
                id: "+/Qpw/",
                defaultMessage: "Continue Game",
                description: "A button that will rejoin the previous game.",
              })}
            </BorderedDiv>
          </Link>
        ) : null}
        <JoinGame />
        <div className={styles.OtherLinks}>
          <Link href={"/archive"} style={{ width: "100%" }}>
            <BorderedDiv style={{ alignItems: "center" }}>
              {intl.formatMessage({
                id: "zOtJ5A",
                defaultMessage: "Archive",
                description: "A button that will open the archive page.",
              })}
            </BorderedDiv>
          </Link>
          <Link href={"/stats"} style={{ width: "100%" }}>
            <BorderedDiv style={{ alignItems: "center" }}>
              {intl.formatMessage({
                id: "aO0PYJ",
                defaultMessage: "Stats",
                description: "A button that will open the statistics page.",
              })}
            </BorderedDiv>
          </Link>
          <Link href={"/map-builder"} style={{ gridColumn: "span 2" }}>
            <BorderedDiv style={{ alignItems: "center" }}>
              {intl.formatMessage({
                id: "OAXWRP",
                defaultMessage: "Map Builder",
                description: "A button that will open the map builder.",
              })}
            </BorderedDiv>
          </Link>
          <Link href={`/supporters`} style={{ gridColumn: "span 2" }}>
            <BorderedDiv style={{ alignItems: "center" }}>
              {intl.formatMessage({
                id: "4Z//RZ",
                defaultMessage: "Supporters",
                description: "A button that will open the supporters page.",
              })}
            </BorderedDiv>
          </Link>
          <Link href={`/FAQ`} style={{ gridColumn: "span 2" }}>
            <BorderedDiv style={{ alignItems: "center" }}>
              {intl.formatMessage({
                id: "pKlkVZ",
                defaultMessage: "FAQ",
                description:
                  "A button that will open the Frequently Asked Questions page.",
              })}
            </BorderedDiv>
          </Link>
          <SupportSection intl={intl} />
        </div>
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
  );
}
