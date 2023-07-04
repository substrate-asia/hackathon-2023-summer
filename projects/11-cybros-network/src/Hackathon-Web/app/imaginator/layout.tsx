import React from "react";
import { AppWrapper } from "@/utils/AppWrapper";

export const metadata = {
  title: "The Imaginator Demo",
  description: "Web3 Job Scheduler connecting everything",
};
function AIGClayout({ children }: { children: React.ReactNode }) {
  return (
    <AppWrapper>
      <div>{children}</div>
    </AppWrapper>
  );
}

export default AIGClayout;
