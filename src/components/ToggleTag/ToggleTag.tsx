import { SymbolX } from "../../icons/svgs";

export default function ToggleTag({ value }: { value: boolean }) {
  return (
    <div
      className="flexRow mediumFont"
      style={{
        width: "100%",
        aspectRatio: 1,
        color: value ? "green" : "red",
        fontWeight: "bold",
      }}
    >
      {value ? (
        <div className="symbol">✓</div>
      ) : (
        <div
          className="flexRow"
          style={{
            width: "80%",
            height: "80%",
          }}
        >
          <SymbolX color="red" />
        </div>
      )}
    </div>
  );
}
