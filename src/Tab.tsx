import { CSSProperties, PropsWithChildren, ReactNode } from "react";
import Chip from "./components/Chip/Chip";
import { rem } from "./util/util";

interface TabProps {
  selectTab: (id: string) => void;
  id: string;
  selectedId: string;
  extraContent?: ReactNode;
}

export function Tab({
  children,
  extraContent,
  id,
  selectedId,
  selectTab,
}: PropsWithChildren<TabProps>) {
  return (
    <Chip
      selected={selectedId === id}
      toggleFn={() => selectTab(id)}
      style={{ fontSize: rem(16), fontFamily: "Myriad Pro" }}
    >
      {children}
      {selectedId === id && extraContent ? extraContent : null}
    </Chip>
  );
}

interface TabBodyProps {
  id: string;
  selectedId: string;
  style?: CSSProperties;
}

export function TabBody({
  children,
  id,
  selectedId,
  style = {},
}: PropsWithChildren<TabBodyProps>) {
  return (
    <div style={{ ...style, display: id === selectedId ? "block" : "none" }}>
      {children}
    </div>
  );
}
