import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/src/entities/product/api";
import { getPosts } from "@/src/entities/post/api";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/Button";

export default async function HomePage() {
  const [products, posts] = await Promise.all([
    getProducts(),
    getPosts({ limit: 3 }),
  ]);

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
          <Link href="/products" className="hover:text-green-600 transition">
            상품
          </Link>
          <Link href="/feed" className="hover:text-green-600 transition">
            일상 피드
          </Link>
          <Link href="/order" className="hover:text-green-600 transition">
            주문 조회
          </Link>
        </nav>
        <Link href="/products" className="ml-auto md:ml-0">
          <Button variant="primary" size="sm">
            상품 보기
          </Button>
        </Link>
      </header>

      {/* ── 히어로 섹션 ── */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden bg-ink">
        <img
          src="https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=1600&q=85"
          alt="고창 텃밭"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        <div className="relative h-full flex flex-col justify-center px-6 md:px-16 max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full w-fit border border-white/20">
            <span className="text-xs font-mono font-bold text-white tracking-widest">
              전북 고창 · 직거래
            </span>
          </div>
          <h1 className="font-serif font-bold text-5xl md:text-6xl text-white mb-6 leading-tight">
            직접 키운 작물,<br />
            그대로 보냅니다
          </h1>
          <p className="text-white/90 text-lg md:text-xl mb-8 max-w-md leading-relaxed">
            가족이 먹고 남은 만큼만. 진짜 텃밭에서.
          </p>
          <div className="flex gap-4">
            <Link href="/products">
              <Button variant="primary" size="md">
                오늘의 작물 보기
              </Button>
            </Link>
            <Link href="/#story">
              <Button variant="secondary" size="md">
                우리 이야기
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 스토리 섹션 ── */}
      <section
        id="story"
        className="py-20 md:py-32 px-4 md:px-8 bg-white border-t border-border"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-serif font-bold text-4xl md:text-5xl text-ink mb-6 leading-tight">
              작은 텃밭에서<br />
              시작했습니다
            </h2>
            <p className="text-lg text-ink-soft leading-relaxed mb-8">
              부모님이 평생 일군 고창의 작은 밭. 팔려고 키운 게 아니라, 먹으려고 키운 작물이라 더 정직합니다.
            </p>
            <Link href="/#story" className="inline-flex items-center gap-2 text-green-600 font-bold hover:gap-3 transition-all">
              이야기 더 읽기
              <span>↓</span>
            </Link>
          </div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-green-100 to-clay-100 flex items-center justify-center">
            <span className="text-ink-soft font-mono text-sm">보더콜리와 아침 밭</span>
          </div>
        </div>
      </section>

      {/* ── 상품 섹션 ── */}
      <section className="py-20 md:py-32 px-4 md:px-8 bg-paper">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between gap-4 mb-12">
            <div>
              <h2 className="font-serif font-bold text-3xl md:text-4xl text-ink mb-2">
                이번 주 작물
              </h2>
              <p className="text-ink-soft font-mono text-sm">
                선착순 · 소량 한정
              </p>
            </div>
            <Link href="/products" className="text-green-600 font-bold hover:underline">
              전체 보기 →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.slice(0, 6).map((product) => (
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
        </div>
      </section>

      {/* ── 피드 섹션 ── */}
      {posts.length > 0 && (
        <section className="py-20 md:py-32 px-4 md:px-8 bg-white border-t border-border">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-serif font-bold text-3xl md:text-4xl text-ink mb-12">
              일상 피드
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link key={post.id} href="/feed">
                  <div className="group bg-white rounded-2xl overflow-hidden border border-border hover:shadow-md transition-all cursor-pointer">
                    <div className="aspect-video bg-gradient-to-br from-green-100 to-clay-100 overflow-hidden flex items-center justify-center">
                      {post.image_url ? (
                        <img
                          src={post.image_url}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <span className="text-4xl">🌿</span>
                      )}
                    </div>
                    <div className="p-6">
                      <p className="text-ink leading-relaxed line-clamp-3 mb-4">
                        {post.body}
                      </p>
                      <p className="text-sm text-ink-soft font-mono">
                        {new Date(post.created_at).toLocaleDateString("ko-KR")}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 푸터 ── */}
      <footer className="bg-ink text-white py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="font-serif font-bold text-lg mb-4">콜리네 텃밭</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                전북 고창 소농 직거래
              </p>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4">메뉴</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li>
                  <Link href="/" className="hover:text-white transition">
                    홈
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-white transition">
                    상품
                  </Link>
                </li>
                <li>
                  <Link href="/feed" className="hover:text-white transition">
                    일상
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4">연락처</h4>
              <p className="text-sm text-white/70 font-mono">
                농협 352-0000-0000-00
              </p>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-sm text-white/50">
            <p>© 2026 콜리네 텃밭. 모든 권리 보유.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
