import { PropsWithChildren } from "react";

export default function OptionalElement({
  value,
  children,
}: PropsWithChildren<{
  value: boolean;
}>) {
  if (!value) {
    return null;
  }
  return <>{children}</>;
}
