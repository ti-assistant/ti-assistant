export default function RelicMenuSVG({ color = "#eee" }: { color?: string }) {
  return (
    <svg viewBox="0 0 53 53" xmlns="http://www.w3.org/2000/svg">
      <path
        d="m15 1.3-11 15-0.074 14 3.8 3.7a4.8 4.8 0 0 1 3.6-1.6 4.8 4.8 0 0 1 4.8 4.8 4.8 4.8 0 0 1-1.6 3.6l9.9 9.8v-15l-9.8-9.7zm23 0.18 0.15 25-9.8 9.7v15l9.9-9.8a4.8 4.8 0 0 1-1.6-3.6 4.8 4.8 0 0 1 4.8-4.8 4.8 4.8 0 0 1 3.6 1.6l3.8-3.7-0.074-14zm-12 6.3-7.5 7v10l6.4 6v-9.3l7.9-7.7zm7.4 8.6-6.3 6.1v8.7l6.3-6z"
        fill={color}
      />
    </svg>
  );
}
