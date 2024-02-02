import { Loader } from "../src/Loader";
import Sidebars from "../src/components/Sidebars/Sidebars";

export default function Loading() {
  return (
    <>
      <Sidebars left="TI ASSISTANT" right="TI ASSISTANT" />
      <Loader />
    </>
  );
}
