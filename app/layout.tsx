import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HELP-ME — Intelligent Assistance",
  description: "Secure SaaS platform for intelligent assistance."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
