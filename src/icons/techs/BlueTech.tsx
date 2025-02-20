export default function BlueTechSVG({
  outline = false,
}: {
  outline?: boolean;
}) {
  const fill = outline ? "none" : "#005384";
  const stroke = outline ? "#eee" : "#00aed9";
  return (
    <svg viewBox="0 0 58 58" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(-58.824 -112.13)" fill={fill} stroke={stroke}>
        <path d="m72.628 114.09h29.837l-14.748 27.344z" stroke-width="2.5" />
        <path
          transform="matrix(.26458 0 0 .26458 62.824 112.13)"
          d="m7.7324 53.484 86.348 153.69 86.348-153.69h-42.602l-36.014 66.693s-4.1883 7.8945-7.7324 7.8945c-3.5441 0-8.0547-8.5391-8.0547-8.5391l-35.871-66.049z"
          stroke-width="8"
        />
      </g>
    </svg>
  );
}
