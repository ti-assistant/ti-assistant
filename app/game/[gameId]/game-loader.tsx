import Sidebars from "../../../src/components/Sidebars/Sidebars";
import { Loader } from "../../../src/Loader";

export default function GameLoader({}) {
  return (
    <>
      <Sidebars left="TI ASSISTANT" right="TI ASSISTANT" />
      <Loader />
    </>
  );
}
