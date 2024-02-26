import type { Metadata } from "next";
import { Cabin, Lato } from "next/font/google";
import "./globals.scss";
import StoreLayout from "./store/StoreLayout";

const cabin = Cabin({ subsets: ["latin"] });
const lato = Lato({ subsets: ["latin"], weight: ['400'] });

export const metadata: Metadata = {
  title: "Next App",
  description: "Next App",
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
