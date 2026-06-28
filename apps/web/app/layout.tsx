import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Lexend } from "next/font/google";
import { appConfig } from "@/lib/app-config";
import { DEFAULT_LAYOUT_SETTINGS } from "@/lib/layout-settings";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const lexend = Lexend({
  variable: "--font-boron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: appConfig.name, template: `%s | ${appConfig.name}` },
  description: "Business management for African SMBs",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} ${lexend.variable} h-full`}
      data-topbar-color={DEFAULT_LAYOUT_SETTINGS.topbarColor}
      data-menu-color={DEFAULT_LAYOUT_SETTINGS.menuColor}
      data-sidenav-size={DEFAULT_LAYOUT_SETTINGS.sidebarSize}
    >
      <body className="min-h-full antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
