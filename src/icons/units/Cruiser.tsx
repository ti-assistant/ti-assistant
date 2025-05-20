import { rem } from "../../util/util";

export default function CruiserSVG({
  size,
  color = "#eee",
}: {
  size: number;
  color?: string;
}) {
  return (
    <svg
      height={rem(size)}
      version="1.1"
      viewBox="0 0 34 17"
      xmlns="http://www.w3.org/2000/svg"
      fill={color}
    >
      <path d="m11 2.4 22 3.3v5.1l-22 3.3v-0.59l-0.67 0.18-0.73-0.18v0.53l-7-2.6-0.059-0.73-1.5-0.18v-1.8h1.5v-0.88h-1.5v-1.8l1.5-0.18 0.059-0.73 7-2.6v0.53l0.73-0.18 0.67 0.18z" />
    </svg>
  );
}
