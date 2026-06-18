import type { Metadata, Viewport } from "next";
import { Gowun_Batang, Nanum_Gothic_Coding } from "next/font/google";
import "./globals.css";

const gowunBatang = Gowun_Batang({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const nanumGothicCoding = Nanum_Gothic_Coding({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "콜리네 텃밭",
  description: "전북 고창 텃밭 농산물 직거래",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ko"
      className={`${gowunBatang.variable} ${nanumGothicCoding.variable} antialiased`}
    >
      <body className="min-h-screen bg-paper text-ink">{children}</body>
    </html>
  );
}
