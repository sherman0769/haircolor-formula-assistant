import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { MobileNav } from "@/components/MobileNav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://haircolor-formula-assistant.vercel.app"),
  title: {
    default: "HairColor Formula Assistant",
    template: "%s｜HairColor Formula Assistant",
  },
  description: "給美髮設計師使用的染髮配方輔助工具",
  openGraph: {
    title: "HairColor Formula Assistant",
    description: "美髮染髮配方助理，提供配方方向、雙氧建議、風險提醒與信心等級。",
    siteName: "HairColor Formula Assistant",
    locale: "zh_TW",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HairColor Formula Assistant",
    description: "美髮染髮配方助理，給專業設計師的配方輔助工具。",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const navItems = [
  { href: "/", label: "首頁" },
  { href: "/formula", label: "配方計算" },
  { href: "/brands", label: "品牌規則" },
  { href: "/about", label: "安全提醒" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-Hant"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="font-sans antialiased">
        <header className="sticky top-0 z-40 border-b border-border bg-panel/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
            <Link href="/" aria-label="HairColor Formula Assistant 首頁">
              <BrandLogo />
            </Link>
            <nav className="hidden flex-wrap gap-1 text-sm text-muted-foreground md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-2 font-medium hover:bg-muted hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="min-w-0 overflow-x-clip pb-24 md:pb-0">{children}</main>
        <footer className="border-t border-border bg-panel/80 px-4 py-5 pb-28 text-center text-xs font-medium text-muted-foreground md:pb-5">
          26肯邦AI進階課程｜李詩民
        </footer>
        <MobileNav />
      </body>
    </html>
  );
}
