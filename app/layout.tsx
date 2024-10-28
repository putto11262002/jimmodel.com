import type { Metadata } from "next";
import "./globals.css";
import { config } from "@/config";

export const metadata: Metadata = {
  metadataBase: new URL(config.url),
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <html lang="en">{children}</html>;
};

export default RootLayout;
