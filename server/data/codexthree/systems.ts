export default function getCodexThreeSystems(): Record<
  CodexThree.SystemId,
  BaseSystem
> {
  return {
    100: {
      expansion: "CODEX THREE",
      id: 100,
      planets: ["Archon Ren Keleres", "Archon Tau Keleres"],
      type: "HOME",
    },
    101: {
      expansion: "CODEX THREE",
      id: 101,
      planets: ["Avar Keleres", "Valk Keleres", "Ylir Keleres"],
      type: "HOME",
    },
    102: {
      expansion: "CODEX THREE",
      id: 102,
      planets: ["Moll Primus Keleres"],
      type: "HOME",
    },
  };
}
