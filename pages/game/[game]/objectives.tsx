import { useRouter } from "next/router";
import { useEffect } from "react";
import { ObjectivePanel } from "../../../src/components/ObjectivePanel";
import ObjectivesHeader from "../../../src/components/ObjectivesHeader/ObjectivesHeader";
import Updater from "../../../src/components/Updater/Updater";
import DataProvider from "../../../src/context/DataProvider";
import { setGameId } from "../../../src/util/api/util";
import { responsivePixels } from "../../../src/util/util";
import { useIntl } from "react-intl";

export default function ObjectivesPage() {
  return (
    <DataProvider>
      <InnerObjectivesPage />
    </DataProvider>
  );
}

function InnerObjectivesPage({}) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;

  const intl = useIntl();

  useEffect(() => {
    if (!!gameid) {
      setGameId(gameid);
    }
  }, [gameid]);

  return (
    <div
      className="flexColumn"
      style={{ height: "100%", alignItems: "center" }}
    >
      <Updater />
      <ObjectivesHeader
        leftSidebar={intl
          .formatMessage({
            id: "5Bl4Ek",
            description: "Cards that define how to score victory points.",
            defaultMessage: "Objectives",
          })
          .toUpperCase()}
        rightSidebar={intl
          .formatMessage({
            id: "5Bl4Ek",
            description: "Cards that define how to score victory points.",
            defaultMessage: "Objectives",
          })
          .toUpperCase()}
        gameId={gameid}
      />
      <div
        style={{
          position: "relative",
          padding: `${responsivePixels(60)} 0 ${responsivePixels(24)} 0`,
          height: "100dvh",
        }}
      >
        <ObjectivePanel />
      </div>
    </div>
  );
}
