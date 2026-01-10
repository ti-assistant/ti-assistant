export default function TradeGoodSVG({ color }: { color?: string }) {
  return (
    <svg
      width="100%"
      height="100%"
      version="1.1"
      viewBox="0 0 9.029 9.244"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="linearGradient114742">
          <stop stopColor="#fff" offset="0" />
          <stop stopColor="#e2cd33" offset="1" />
        </linearGradient>
        <radialGradient
          id="radialGradient114744"
          cx="-36.5"
          cy="69.34"
          r="17.06"
          gradientTransform="matrix(.2838 .0003044 -.000517 .4819 105.8 94.96)"
          gradientUnits="userSpaceOnUse"
          xlinkHref="#linearGradient114742"
        />
      </defs>
      <g transform="translate(-90.9 -123.7)">
        <path
          d="m95.41 123.7-0.4796 0.1323-0.2977 0.215-2.811 1.554-0.09922 0.1654 0.01654 0.6945-0.2646 0.248-0.5292 0.1323-0.04961 3.919 3.588 2.133 0.463 0.0496 0.2811-0.2811v-4.539h0.3638v4.539l0.2811 0.2811 0.463-0.0496 3.588-2.133-0.0496-3.919-0.5292-0.1323-0.2646-0.248 0.0165-0.6945-0.0992-0.1654-2.811-1.554-0.2977-0.215zm0 0.5126 3.059 1.687 0.1158 0.1654v0.1323l-0.2811 0.1984-2.894 1.488-2.894-1.488-0.2811-0.1984v-0.1323l0.1158-0.1654z"
          fill={color ?? "url(#radialGradient114744)"}
        />
      </g>
    </svg>
  );
}
