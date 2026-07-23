import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "VANILLA+ — Пополнение аккаунта",
  description: "Пополнение баланса на сервере Garry's Mod VANILLA+",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body className="bg-neutral-950 text-white antialiased">{children}</body>
    </html>
  );
}
