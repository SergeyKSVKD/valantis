import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.scss";
import StoreLayout from "./store/StoreLayout";

const lato = Lato({ subsets: ["latin"], weight: ['400'] });

export const metadata: Metadata = {
  title: "Valantis",
  description: "Valantis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru-Ru">
      <StoreLayout>
        <body className={lato.className}>
          {children}
        </body>
      </StoreLayout>
    </html>
  );
}
