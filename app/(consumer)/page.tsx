import Link from "next/link";

const PRODUCTS = [
  { id: 1, name: "황토 고구마", detail: "5kg 박스", price: 25000, stock: 8, status: "active" as const },
  { id: 2, name: "유기농 배추", detail: "1포기", price: 18000, stock: 0, status: "sold_out" as const },
];

const POSTS = [
  { id: 1, body: "오늘 고구마 캤어요! 올해는 작황이 좋아서 알이 굵고 단단해요 :)", daysAgo: 2 },
];

function formatPrice(n: number) {
  return n.toLocaleString("ko-KR") + "원";
}

const NAV_LINKS = [
  { label: "상품", href: "/products" },
  { label: "일상", href: "/feed" },
  { label: "주문 확인", href: "/order" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-20 md:pb-0">

      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#FAF7F2]/95 backdrop-blur border-b border-[#E8E2D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14 md:h-16">
          <Link href="/" className="text-[#386144] font-bold text-xl tracking-tight">
            콜리네 텃밭
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#555]">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-[#386144] transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Mobile cart icon */}
          <button
            type="button"
            aria-label="장바구니"
            className="md:hidden w-9 h-9 rounded-xl bg-[#D8EFE0] flex items-center justify-center"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#386144" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-[#21422E] relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 md:w-96 md:h-96 rounded-full bg-white opacity-[0.04]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-20">
          <span className="inline-block bg-[#D4813A] text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
            고창 직송
          </span>
          <h1 className="text-white text-[28px] md:text-5xl font-bold leading-snug mb-3 md:mb-5">
            부모님 텃밭에서<br />직접 키운 농산물
          </h1>
          <p className="text-[#C7E8D1] text-sm md:text-base mb-8 md:mb-10">
            전북 고창 · 무농약 · 소량 직거래
          </p>
          <Link
            href="/products"
            className="inline-block bg-[#D4813A] text-white text-sm font-semibold px-7 py-3 rounded-full hover:bg-[#c07330] transition-colors"
          >
            지금 구매하기
          </Link>
        </div>
      </section>

      {/* Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 md:pt-12">
        <div className="flex items-baseline justify-between mb-4 md:mb-6">
          <h2 className="text-[#1C1C1C] text-lg md:text-2xl font-bold">지금 살 수 있어요</h2>
          <Link href="/products" className="text-[#386144] text-sm hover:underline">
            전체 보기 →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {PRODUCTS.map((p) => (
            <Link key={p.id} href={`/products/${p.id}`}>
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md active:scale-[0.98] transition-all">
                <div className={`h-32 md:h-44 flex items-center justify-center ${
                  p.status === "sold_out" ? "bg-[#F5E8D5]" : "bg-[#D8EFE0]"
                }`}>
                  <span className="text-xs text-[#B0A899]">사진</span>
                </div>
                <div className="p-3 md:p-4">
                  <p className="font-bold text-[#1C1C1C] text-sm md:text-base mb-0.5">{p.name}</p>
                  <p className="text-[#888] text-xs md:text-sm mb-2">{p.detail}</p>
                  <p className="text-[#D4813A] font-semibold text-sm md:text-base">{formatPrice(p.price)}</p>
                  <div className="mt-2.5">
                    {p.status === "sold_out" ? (
                      <span className="text-[10px] bg-[#EBEBEB] text-[#888] px-2 py-0.5 rounded-full">품절</span>
                    ) : (
                      <span className="text-[10px] bg-[#D8EFE0] text-[#386144] px-2 py-0.5 rounded-full">
                        잔여 {p.stock}박스
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Feed */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 md:pt-12 pb-8">
        <h2 className="text-[#1C1C1C] text-lg md:text-2xl font-bold mb-4 md:mb-6">농장 일상</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
          {POSTS.map((post) => (
            <Link key={post.id} href="/feed">
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md flex min-h-24 active:scale-[0.99] transition-all">
                <div className="w-28 md:w-36 shrink-0 bg-[#D8EFE0] flex items-center justify-center">
                  <span className="text-xs text-[#B0A899]">사진</span>
                </div>
                <div className="p-4 flex flex-col justify-between">
                  <p className="text-[#1C1C1C] text-sm leading-relaxed line-clamp-3">{post.body}</p>
                  <p className="text-[#B0A899] text-xs mt-2">{post.daysAgo}일 전</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom nav — mobile only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8E2D9] z-10">
        <div className="grid grid-cols-4 h-16">
          {[
            { label: "홈", href: "/", active: true },
            { label: "상품", href: "/products", active: false },
            { label: "일상", href: "/feed", active: false },
            { label: "주문", href: "/order", active: false },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors ${
                item.active ? "text-[#386144]" : "text-[#B0A899]"
              }`}
            >
              {item.active && (
                <div className="w-5 h-0.5 rounded-full bg-[#386144] -mb-0.5" />
              )}
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

    </div>
  );
}
