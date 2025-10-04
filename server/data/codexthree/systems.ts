export default function getCodexThreeSystems(): Record<
  CodexThree.SystemId,
  BaseSystem
> {
  return {
    200: {
      expansion: "CODEX THREE",
      id: 200,
      planets: ["Archon Ren Keleres", "Archon Tau Keleres"],
      type: "HOME",
    },
    201: {
      expansion: "CODEX THREE",
      id: 201,
      planets: ["Avar Keleres", "Valk Keleres", "Ylir Keleres"],
      type: "HOME",
    },
    202: {
      expansion: "CODEX THREE",
      id: 202,
      planets: ["Moll Primus Keleres"],
      type: "HOME",
    },
  };
}
