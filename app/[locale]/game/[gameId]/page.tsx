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
          gap: rem(16),
        }}
      >
        <div className="flexColumn" style={{ alignItems: "stretch" }}>
          <Link
            href={`/game/${gameId}/main`}
            className="primary"
            style={{ fontSize: rem(44), lineHeight: 1 }}
          >
            {intl.formatMessage({
              id: "yBACfb",
              description:
                "Text on a button that opens the main screen of the assistant.",
              defaultMessage: "Main Screen",
            })}
          </Link>
          <Conditional appSection="OBJECTIVES">
            <Link
              href={`/game/${gameId}/objectives`}
              className="outline"
              style={{ fontSize: rem(32) }}
            >
              {intl.formatMessage({
                id: "9m91nk",
                description:
                  "Text on a button that opens the objective view of the assistant.",
                defaultMessage: "Objective View",
              })}
            </Link>
          </Conditional>
        </div>
        <FactionLinks />
      </div>
    </div>
  );
}
