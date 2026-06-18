import type { Metadata, Viewport } from "next";
import {
  Noto_Sans_KR,
  Noto_Serif_KR,
  Nanum_Gothic_Coding,
} from "next/font/google";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

const notoSerifKR = Noto_Serif_KR({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
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
      className={`${notoSansKR.variable} ${notoSerifKR.variable} ${nanumGothicCoding.variable} antialiased`}
    >
      <body className="min-h-screen bg-paper text-ink">{children}</body>
    </html>
  );
}
