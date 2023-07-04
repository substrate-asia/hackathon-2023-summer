"use client";
import * as React from "react";
import { WagmiConfig } from "wagmi";
import { PROJECT_WAGMI_CONFIG } from "./WagmiConfig";
import { Provider as JotaiProvider } from "jotai";

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return (
    <JotaiProvider>
      <WagmiConfig config={PROJECT_WAGMI_CONFIG}>
        {mounted && children}
      </WagmiConfig>
    </JotaiProvider>
  );
}
