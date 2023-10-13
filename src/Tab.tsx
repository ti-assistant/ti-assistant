import { CSSProperties, PropsWithChildren, ReactNode } from "react";

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
    <button
      onClick={() => selectTab(id)}
      className={selectedId === id ? "selected" : ""}
    >
      {children}
      {selectedId === id && extraContent ? extraContent : null}
    </button>
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
