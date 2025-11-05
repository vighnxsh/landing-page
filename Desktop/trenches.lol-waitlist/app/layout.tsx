import "./globals.css";
import PrivyProviderClient from "../components/PrivyProviderClient";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "trenches.lol",
  description: "Phaser game running in Next.js"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bitcount+Grid+Single:wght@100..900&display=swap"
          rel="stylesheet"
        />
        <meta name="color-scheme" content="light" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body style={{ margin: 0 }}>
        <PrivyProviderClient>
          <Navbar />
          <div style={{ height: "var(--navbar-height)" }} />
          {children}
        </PrivyProviderClient>
      </body>
    </html>
  );
}
