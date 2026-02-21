"use client";

import { PropsWithChildren, ReactNode } from "react";
import { useOptions } from "../../context/dataHooks";

export default function Conditional({
  appSection,
  children,
  fallback,
}: PropsWithChildren<{ appSection: AppSection; fallback?: ReactNode }>) {
  const options = useOptions();

  if (options.hide?.includes(appSection)) {
    return fallback ?? null;
  }

  return children;
}
