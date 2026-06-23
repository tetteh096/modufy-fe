import { Inter } from "next/font/google";
import "./storefront.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export default function PublicStorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`storefront-root min-h-screen ${inter.variable}`}>
      {children}
    </div>
  );
}
