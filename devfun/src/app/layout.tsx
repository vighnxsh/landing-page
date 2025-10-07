import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";


export const metadata: Metadata = {
  title: "dev.fun - AI-Powered App Launcher",
  description: "Turn ideas into live apps in under a minute. No coding required. Create viral tools and games for your pump.fun coins instantly.",
  keywords: "AI, app creation, pump.fun, crypto, web3, no-code, rapid prototyping",
  openGraph: {
    title: "dev.fun - AI-Powered App Launcher",
    description: "Turn ideas into live apps in under a minute. No coding required.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased bg-black text-white`} suppressHydrationWarning>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
