import Link from "next/link";
import Conditional from "../../../../src/components/Conditional/Conditional";
import { getIntl } from "../../../../src/util/server";
import { rem } from "../../../../src/util/util";
import ControlButtons from "./ControlButtons";
import FactionLinks from "./FactionLinks";
import styles from "./game-page.module.scss";

export default async function Page({
  params,
}: PageProps<"/[locale]/game/[gameId]">) {
  const { gameId, locale } = await params;

  const intl = await getIntl(locale);

  return (
    <div className={styles.GamePage}>
      <ControlButtons />
      <div
        className="flexColumn"
        style={{
          alignItems: "stretch",
          maxWidth: rem(500),
          width: "100%",
        }}
      >
        <Link href={`/game/${gameId}/main`}>
          <div
            style={{
              border: `${"3px"} solid grey`,
              borderRadius: rem(5),
              height: `10vh`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: rem(24),
              cursor: "pointer",
            }}
          >
            {intl.formatMessage({
              id: "yBACfb",
              description:
                "Text on a button that opens the main screen of the assistant.",
              defaultMessage: "Main Screen",
            })}
          </div>
        </Link>
        <Conditional appSection="OBJECTIVES">
          <Link href={`/game/${gameId}/objectives`}>
            <div
              style={{
                border: `${"3px"} solid grey`,
                borderRadius: rem(5),
                height: `8vh`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: rem(24),
                cursor: "pointer",
              }}
            >
              {intl.formatMessage({
                id: "9m91nk",
                description:
                  "Text on a button that opens the objective view of the assistant.",
                defaultMessage: "Objective View",
              })}
            </div>
          </Link>
        </Conditional>
        <FactionLinks />
      </div>
    </div>
  );
}
