export default function ActionCardsSVG({ color = "#eee" }: { color?: string }) {
  return (
    <svg
      width="100%"
      height="100%"
      version="1.1"
      viewBox="0 0 60 75"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(89.06 34.14)" fill={color}>
        <path d="m-58.66-29.92v8.372l-20.95 12.14v19.1l8.335 4.812 5.102-8.836-5.649-3.262 17.56-10.14v20.14l-5.529-3.192-8.764 15.18-16.17-9.334v-30.05z" />
        <path d="m-54.47-19.29v5.92l14.6 8.427v24.04l-20.19 11.66v5.769l27.34-15.78v-27.58z" />
      </g>
    </svg>
  );
}
