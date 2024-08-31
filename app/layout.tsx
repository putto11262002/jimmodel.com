import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import config from "@/config/global";

const inter = Inter({ subsets: ["latin"] });
console.log("debug config", config);

export const metadata: Metadata = {
  metadataBase: new URL(config.url),
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
};

export default RootLayout;
