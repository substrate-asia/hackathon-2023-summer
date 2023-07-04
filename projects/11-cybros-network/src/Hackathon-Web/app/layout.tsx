import "app/globals.css";
import { Inter } from "next/font/google";
import React from "react";
import StyledComponentsRegistry from "@/app/registry";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Cybros",
  description: "Web3 Job Scheduler connecting everything",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
