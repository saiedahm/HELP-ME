import type { Metadata } from "next";
import "./globals.css";
import AccessGate from "../components/access-gate";

export const metadata: Metadata = {
  title: "HELP ME",
  description: "Tell me what you need. I'll help you get it done.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body>
        {children}
        <AccessGate />
      </body>
    </html>
  );
}
