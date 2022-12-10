import { useRouter } from "next/router";
import useSWR, { useSWRConfig } from "swr";
import { fetcher } from "./util/api/util";
import { repealAgenda } from "./util/api/agendas";
import { AgendaRow } from "./AgendaRow";


export function LawsInEffect({}) {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { mutate } = useSWRConfig();
  const { data: agendas } = useSWR(gameid ? `/api/${gameid}/agendas` : null, fetcher);

  function removeAgenda(agendaName) {
    repealAgenda(mutate, gameid, agendas, agendaName);
  } 

  const passedLaws = Object.values(agendas ?? {}).filter((agenda) => {
    return agenda.passed && agenda.type === "law";
  });

  if (passedLaws.length > 0) {
    return (
      <div className='flexColumn' style={{gap: "8px"}}>
        Laws in Effect
        <div className="flexColumn" style={{alignItems: "flex-start", gap: "8px"}}>
          {passedLaws.map((agenda) => <AgendaRow key={agenda.name} agenda={agenda} removeAgenda={removeAgenda} />)}
        </div>
      </div>
    );
  }
  return null;
}