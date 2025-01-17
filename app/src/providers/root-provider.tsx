import React from "react";
import QueryProvider from "./query-provider";

type Props = {
  children: React.ReactNode;
};

export default function RootProvider({ children }: Props) {
  return (
    <>
      <QueryProvider>{children}</QueryProvider>
    </>
  );
}
