export default function ThundersEdgeMenuSVG({
  color = "#eee",
}: {
  color?: string;
}) {
  return (
    <svg
      width="100%"
      height="100%"
      version="1.1"
      viewBox="0 0 60 60"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(89.06 34.14)">
        <path
          d="m-54.47-19.29v5.92l14.6 8.427v24.04l-20.19 11.66v5.769l27.34-15.78v-27.58z"
          display="none"
          fill={color}
        />
        <path
          d="m-59.05-32.14a28 28 0 0 0-28 28 28 28 0 0 0 12.84 23.52l15.46-15.1h-17.95l24.04-22.93h-14.2l11.66-13.22a28 28 0 0 0-3.848-0.2679zm23.13 12.22-23.84 19.22h17.45l-26.58 22.75a28 28 0 0 0 9.845 1.802 28 28 0 0 0 28-28 28 28 0 0 0-4.867-15.77z"
          fill={color}
        />
      </g>
    </svg>
  );
}
