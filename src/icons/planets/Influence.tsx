import { rem } from "../../util/util";

export default function InfluenceSVG({ influence }: { influence: number }) {
  const fontSize = influence > 9 ? rem(6) : rem(7);
  const fontY = influence > 9 ? "173" : "173.33505";

  return (
    <svg
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
          <feFlood floodColor="#72d4f7" result="flood" />
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
          stroke="#72d4f7"
          strokeWidth="4"
        />
        <text
          x="140.481"
          y={fontY}
          fill="#eee"
          fontFamily="Slider"
          fontSize={fontSize}
          textAnchor="middle"
        >
          {/* <tspan
            x="140.481"
            y="173.33505"
            stroke-width=".2646"
            text-align="center"
            text-anchor="middle"
          > */}
          {influence}
          {/* </tspan> */}
        </text>
      </g>
    </svg>
  );
}
