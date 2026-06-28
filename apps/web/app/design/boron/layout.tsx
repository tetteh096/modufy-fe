import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "@/design/boron/boron-variables.css";
import "@/design/boron/boron-tailwind-v4.css";

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-boron",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Boron preview",
  description: "Coderthemes Boron Neubrutalism design system preview on Modufy",
};

export default function BoronPreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={lexend.variable} style={{ minHeight: "100vh" }}>
      {children}
    </div>
  );
}
