import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HELP-ME Business — AI Customer Assistants",
  description: "Create smart AI customer assistants for your business website.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
