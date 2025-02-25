export default function RedTechSVG({ outline = false }: { outline?: boolean }) {
  const fill = outline ? "none" : "#960010";
  const stroke = outline ? "#eee" : "#ff6070";
  return (
    <svg
      viewBox="0 0 61 61"
      xmlns="http://www.w3.org/2000/svg"
      fill={fill}
      stroke={stroke}
      stroke-width="2"
      stroke-linecap="butt"
      stroke-linejoin="round"
    >
      <g transform="translate(-73.388737,-84.679497)">
        <path
          d="M 82.00835,101.19584 100.0785,87.221781 v 27.948099 z"
          id="path3717"
        />
        <path
          d="M 127.07486,101.19583 109.0047,115.16989 V 87.221789 Z"
          id="path3717-7"
        />
        <path
          stroke-width="7.54333"
          stroke-linejoin="miter"
          d="m 94.320312,40.669922 c -1.53274,0.0055 -3.387085,0.08298 -4.915943,0.232422 v 0 l 0.165936,81.208986 c 0,0 -2.738815,13.85493 -18.042968,2.90039 C 57.260109,114.79939 36.139415,97.689119 33.123047,95.242188 29.318483,106.94758 27.3458,119.61467 27.332031,132.42773 c -3.54e-4,50.67736 29.991417,91.75974 66.988281,91.75977 36.996858,-4e-5 66.988628,-41.08242 66.988278,-91.75977 -0.0134,-12.79206 -1.97928,-25.43896 -5.77148,-37.128902 -2.49025,2.142516 -23.00929,19.739672 -37.39844,30.009762 -15.30701,10.92522 -18.04492,-2.89257 -18.04492,-2.89257 l -0.162109,-80.492192 -0.0078,-0.886719 c -1.863276,-0.22952 -3.732754,-0.352023 -5.603516,-0.367187 z"
          transform="matrix(0.26458333,0,0,0.26458333,79.588737,84.679497)"
        />
        <rect
          fill={stroke}
          stroke="none"
          id="rect7644"
          width="2.8282318"
          height="22.169947"
          x="103.24364"
          y="95.501572"
        />
      </g>
    </svg>
  );
}
