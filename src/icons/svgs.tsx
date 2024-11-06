export function SymbolX({
  color = "var(--neutral-border)",
}: {
  color?: string;
}) {
  return (
    <svg viewBox="0 0 100 100" stroke={color} strokeWidth={"7px"}>
      <path d="M 22 22 L 78 78"></path>
      <path d="M 78 22 L 58 42 M 42 58 L 22 78"></path>
    </svg>
  );
}
