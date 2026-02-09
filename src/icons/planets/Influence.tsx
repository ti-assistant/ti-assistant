export default function InfluenceSVG({
  color = "#72d4f7",
  influence,
}: {
  color?: string;
  influence: number;
}) {
  const fontSize = influence > 9 ? "8px" : "11px";
  const fontY = influence > 9 ? "172.5" : "173.33505";

  return (
    <svg
      width="100%"
      height="100%"
      version="1.1"
      viewBox="0 0 18.98 21.23"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter
          id="filter45612"
          x="-.1534"
          y="-.1328"
          width="1.307"
          height="1.266"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodColor={color} result="flood" />
          <feComposite
            in="SourceGraphic"
            in2="flood"
            operator="in"
            result="composite1"
          />
          <feGaussianBlur in="composite1" result="blur" stdDeviation="4" />
          <feOffset dx="0" dy="0" result="offset" />
          <feComposite in="SourceGraphic" in2="offset" result="composite2" />
        </filter>
      </defs>
      <g transform="translate(-131.2 -159.1)">
        <path
          transform="matrix(.2736 0 0 .2736 136.4 163.4)"
          d="m42.01 38.36-26.55 15.33-26.55-15.33v-30.65l26.55-15.33 26.55 15.33z"
          fill="none"
          filter="url(#filter45612)"
          stroke={color}
          strokeWidth="4"
        />
        <text
          x="140.481"
          y={fontY}
          fill={color === "#555" ? "#555" : "#eee"}
          fontFamily="var(--main-font)"
          fontSize={fontSize}
          textAnchor="middle"
        >
          {influence}
        </text>
      </g>
    </svg>
  );
}
