export default function ResourcesSVG({
  color = "#fad54d",
  resources,
}: {
  color?: string;
  resources: number;
}) {
  const fontSize = resources > 9 ? "8px" : "11px";
  const fontY = resources > 9 ? "172.5" : "173.33505";
  return (
    <svg
      width="100%"
      height="100%"
      version="1.1"
      viewBox="0 0 20.5 21.75"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter
          id="filter41896"
          x="-.1331"
          y="-.1236"
          width="1.266"
          height="1.247"
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
      <g transform="translate(-131.6 -158.6)">
        <path
          transform="scale(.2646)"
          d="m531.2 607.8a33.03 33.03 0 0 0-25.49 15.25l3.439 5.562a27.4 27.4 0 0 0-2.961 12.36 27.4 27.4 0 0 0 2.717 11.89l-3.479 5.104a33.03 33.03 0 0 0 26.41 15.73l3.996-5.432a27.4 27.4 0 0 0 21.17-13.12h6.285a33.03 33.03 0 0 0 3.314-14.42 33.03 33.03 0 0 0-3.531-14.86h-6.629a27.4 27.4 0 0 0-20.68-12.21z"
          fill="none"
          filter="url(#filter41896)"
          stroke={color}
          strokeWidth="4"
        />
        <text
          x="141.05365"
          y={fontY}
          fill={color === "#555" ? "#555" : "#eee"}
          fontFamily="var(--main-font)"
          fontSize={fontSize}
          textAnchor="middle"
        >
          {resources}
        </text>
      </g>
    </svg>
  );
}
