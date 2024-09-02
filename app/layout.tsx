import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import webConfig from "@/config/web";
import config from "@/config/global";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(config.url),
  title: webConfig.seo.title,
  description: webConfig.seo.description,
  applicationName: webConfig.seo.applicationName,
  keywords: webConfig.seo.keywords,
  openGraph: webConfig.seo.openGraph,
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
