import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { getProducts } from "@/src/entities/product/api";
import { getPosts } from "@/src/entities/post/api";
import { ProductCard } from "@/src/entities/product/ui/ProductCard";
import { BottomNav } from "@/src/shared/ui/BottomNav";
import { Button } from "@/src/shared/ui/button";
import { formatDate } from "@/src/shared/utils/format";

export default async function HomePage() {
  const [products, posts] = await Promise.all([
    getProducts(),
    getPosts({ limit: 3 }),
  ]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-20 md:pb-0">

      {/* ── 네비게이션 (Graza식: 로고 + CTA만) ── */}
      <header className="absolute top-0 left-0 right-0 z-20 px-4 sm:px-8 flex items-center justify-between h-16 md:h-20">
        <Link href="/" className="text-white font-bold text-xl tracking-tight drop-shadow">
          콜리네 텃밭
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/products"
            className="hidden md:inline-flex items-center gap-1.5 text-white/90 text-sm font-medium hover:text-white transition-colors"
          >
            상품 <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/order"
            className="w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-colors"
            aria-label="주문 확인"
          >
            <ShoppingBag className="w-4.5 h-4.5 text-white" />
          </Link>
        </div>
      </header>

      {/* ── 히어로: 풀스크린 이미지 + 텍스트 오버레이 ── */}
      <section className="relative h-[85vh] min-h-[560px] md:h-screen overflow-hidden">
        {/* 배경 이미지 */}
        <img
          src="https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=1600&q=85"
          alt="고창 텃밭"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* 그라디언트 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

        {/* 텍스트 */}
        <div className="relative h-full flex flex-col justify-end px-6 sm:px-10 pb-14 md:pb-20 max-w-3xl">
          <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-5 w-fit border border-white/30">
            🌱 전북 고창 직송
          </span>
          <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight mb-5">
            부모님 텃밭에서<br />직접 키운
          </h1>
          <p className="text-white/80 text-base md:text-lg mb-8 max-w-sm leading-relaxed">
            무농약 · 소량 재배 · 수확 당일 발송
          </p>
          <Button asChild size="lg" className="w-fit rounded-full px-8 bg-white text-[#386144] hover:bg-white/90 font-bold text-base shadow-lg">
            <Link href="/products">지금 구매하기</Link>
          </Button>
        </div>
      </section>

      {/* ── 상품 섹션 ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 md:pt-20">
        <div className="flex items-baseline justify-between mb-6 md:mb-8">
          <h2 className="text-[#1C1C1C] text-xl md:text-2xl font-bold">지금 살 수 있어요</h2>
          <Link href="/products" className="flex items-center gap-1 text-[#386144] text-sm font-medium hover:underline">
            전체 보기 <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {products.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ── 브랜드 스토리 띠 ── */}
      <section className="my-16 md:my-24 bg-[#21422E] py-14 md:py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[#a8d4b8] text-sm font-semibold uppercase tracking-widest mb-4">Our Story</p>
          <h2 className="text-white text-2xl md:text-3xl font-bold leading-snug mb-5">
            대형마트에선 살 수 없는<br />진짜 텃밭 농산물
          </h2>
          <p className="text-[#C7E8D1] text-sm md:text-base leading-relaxed">
            전북 고창 작은 텃밭에서 부모님이 직접 키운 농산물입니다.<br />
            수확이 있을 때만, 소량만 팝니다.
          </p>
        </div>
      </section>

      {/* ── 피드 ── */}
      {posts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 md:pb-20">
          <h2 className="text-[#1C1C1C] text-xl md:text-2xl font-bold mb-6 md:mb-8">농장 일상</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <Link key={post.id} href="/feed">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md flex h-28 active:scale-[0.99] transition-all">
                  <div className="w-28 shrink-0 bg-[#D8EFE0] flex items-center justify-center overflow-hidden">
                    {post.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={post.image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl">🌿</span>
                    )}
                  </div>
                  <div className="p-4 flex flex-col justify-between min-w-0">
                    <p className="text-[#1C1C1C] text-sm leading-relaxed line-clamp-3">{post.body}</p>
                    <p className="text-[#B0A899] text-xs mt-1">{formatDate(post.created_at)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <BottomNav active="home" />
    </div>
  );
}
