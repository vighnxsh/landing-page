import "./globals.css";
import Navbar from "../components/Navbar";
import PrivyProviderClient from "../components/PrivyProviderClient";

export const metadata = {
  title: "trenches.lol",
  description: "Phaser game running in Next.js"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <PrivyProviderClient>
          <Navbar />
          <div style={{ paddingTop: "var(--navbar-height)" }}>{children}</div>
        </PrivyProviderClient>
      </body>
    </html>
  );
}
