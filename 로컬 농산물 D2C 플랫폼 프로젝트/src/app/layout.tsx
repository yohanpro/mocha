import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '콜리네 텃밭 — 전북 고창 소농 직거래',
  description: '전북 고창에서 직접 키운 신선한 농산물을 산지 직송으로 만나보세요.',
  openGraph: {
    title: '콜리네 텃밭',
    description: '전북 고창 소농 직거래 플랫폼',
    locale: 'ko_KR',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
