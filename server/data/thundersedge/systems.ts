export default function getThundersEdgeSystems(): Record<
  ThundersEdge.SystemId,
  BaseSystem
> {
  return {
    666: {
      expansion: "THUNDERS EDGE",
      id: 666,
      planets: ["Cocytus"],
      type: "RED",
    },
    667: {
      expansion: "THUNDERS EDGE",
      id: 667,
      planets: ["Styx"],
      type: "RED",
    },
    668: {
      expansion: "THUNDERS EDGE",
      id: 668,
      planets: ["Lethe", "Phlegethon"],
      type: "HOME",
    },
  };
}
