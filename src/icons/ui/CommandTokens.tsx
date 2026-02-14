export default function CommandTokensSVG({ tokens }: { tokens: number }) {
  const fontSize = tokens < 10 ? "72px" : "60px";
  const fontY = tokens < 10 ? "90" : "95";

  return (
    <svg
      width="100%"
      height="100%"
      version="1.1"
      viewBox="0 0 136 116"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path
          d="m57.8 9.25-48.3 82.2 9.02 15.3h98.6l9.48-16.1-47.9-81.4z"
          fill="none"
          stroke="#eee"
          strokeWidth="2.51"
        />
        <text
          x="68"
          y={fontY}
          fill="#eee"
          fontFamily="var(--main-font)"
          fontSize={fontSize}
          textAnchor="middle"
          strokeWidth="2.99"
        >
          {tokens}
        </text>
      </g>
    </svg>
  );
}
