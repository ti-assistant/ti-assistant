export default function YellowTechSVG({
  outline = false,
}: {
  outline?: boolean;
}) {
  const fill = outline ? "none" : "#757700";
  const stroke = outline ? "#eee" : "#f3e739";
  return (
    <svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(-120.95 -105.13)" fill={fill} stroke={stroke}>
        <path
          transform="matrix(.26458 0 0 .26458 120.95 105.13)"
          d="m173.28 7.291-43.941 0.095703a65.035 75.06 0 0 1 29.857 58.113l20.488-42.604s1.2363-4.5568 1.2363-5.582c0-1.0252 0.22354-3.9868-1.3496-6.7207-1.5731-2.7339-6.291-3.3027-6.291-3.3027zm-114.17 0.24609-44.156 0.095703s-4.2711 0.34165-6.8555 3.1895c-2.5844 2.8478 0.67383 11.504 0.67383 11.504l20.711 42.633a65.035 75.06 0 0 1 29.627-57.422zm65.764 129.32a65.035 75.06 0 0 1-30.557 8.8242 65.035 75.06 0 0 1-29.654-8.3125l17.822 36.686 2.584 5.3535s2.9221 4.7852 9.6641 4.7852c6.742 0 9.3262-4.8984 9.3262-4.8984l3.1465-5.6973z"
          stroke-width="9"
        />
        <ellipse
          cx="145.85"
          cy="123.82"
          rx="14.309"
          ry="17.142"
          stroke-width="1.9537"
        />
      </g>
    </svg>
  );
}
