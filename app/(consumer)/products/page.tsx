import Link from "next/link";
import { getProducts } from "@/src/entities/product/api";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/Button";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-paper">
      {/* ── 헤더 ── */}
      <header className="sticky top-0 z-20 bg-white border-b border-border px-4 md:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex-none">
          <span className="font-serif font-bold text-2xl text-green-700">
            콜리네 텃밭
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-base font-medium text-ink mx-auto">
          <Link href="/" className="hover:text-green-600 transition">
            홈
          </Link>
          <Link href="/products" className="text-green-600 font-bold">
            상품
          </Link>
          <Link href="/feed" className="hover:text-green-600 transition">
            일상 피드
          </Link>
          <Link href="/order" className="hover:text-green-600 transition">
            주문 조회
          </Link>
        </nav>
        <Link href="/order" className="ml-auto md:ml-0">
          <Button variant="secondary" size="sm">
            주문 조회
          </Button>
        </Link>
      </header>

      {/* ── 콘텐츠 ── */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="mb-12">
          <h1 className="font-serif font-bold text-4xl md:text-5xl text-ink mb-3">
            오늘의 작물
          </h1>
          <p className="text-ink-soft text-lg">
            그날 캔 만큼만. 소량 한정으로 올립니다.
          </p>
        </div>

        {/* ── 필터 탭 ── */}
        <div className="flex gap-2 mb-8">
          <button className="px-4 py-2 rounded-full bg-green-600 text-white font-bold text-sm">
            전체
          </button>
          <button className="px-4 py-2 rounded-full bg-green-100 text-ink-soft font-bold text-sm hover:bg-green-100/80 transition">
            채소
          </button>
          <button className="px-4 py-2 rounded-full bg-green-100 text-ink-soft font-bold text-sm hover:bg-green-100/80 transition">
            뿌리작물
          </button>
        </div>

        {/* ── 상품 그리드 ── */}
        {products.length === 0 ? (
          <div className="text-center py-32 text-ink-soft">
            <p className="text-xl font-medium mb-2">현재 판매 중인 상품이 없어요</p>
            <p className="text-sm">곧 새로운 상품이 올라올 예정이에요 🌱</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image_url || undefined}
                stock={product.stock || 0}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── 푸터 ── */}
      <footer className="bg-ink text-white py-12 px-4 md:px-8 mt-20">
        <div className="max-w-6xl mx-auto text-center text-sm text-white/50">
          <p>© 2026 콜리네 텃밭. 모든 권리 보유.</p>
        </div>
      </footer>
    </div>
  );
}
