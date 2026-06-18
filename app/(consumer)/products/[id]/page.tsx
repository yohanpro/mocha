import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct } from "@/src/entities/product/api";
import { StockBadge } from "@/components/StockBadge";
import { Button } from "@/components/Button";
import { OrderButton } from "./OrderButton";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product || product.status === "hidden") notFound();

  const isSoldOut = product.stock === 0;

  return (
    <div className="min-h-screen bg-paper">
      {/* ── 헤더 ── */}
      <header className="sticky top-0 z-20 bg-white border-b border-border px-4 md:px-8 py-4 flex items-center justify-between">
        <Link href="/products" className="text-ink-soft hover:text-ink transition font-bold">
          ← 상품 목록
        </Link>
        <span className="font-serif font-bold text-2xl text-green-700">
          콜리네 텃밭
        </span>
        <div className="w-16" />
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* ── 이미지 ── */}
          <div>
            <div className="rounded-2xl overflow-hidden mb-6 bg-gradient-to-br from-green-100 to-clay-100 flex items-center justify-center aspect-square">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-ink-soft font-mono text-sm">
                  {product.name} 사진
                </span>
              )}
            </div>

            {/* ── 썸네일 ── */}
            <div className="flex gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-100 to-clay-100 flex items-center justify-center text-xs text-ink-soft"
                >
                  추가 사진
                </div>
              ))}
            </div>
          </div>

          {/* ── 정보 ── */}
          <div className="md:sticky md:top-24">
            <h1 className="font-serif font-bold text-4xl text-ink mb-4">
              {product.name}
            </h1>
            <div className="font-mono font-bold text-3xl text-ink mb-4">
              {product.price.toLocaleString()}원
            </div>

            {!isSoldOut && (
              <div className="mb-6">
                <StockBadge
                  stock={product.stock || 0}
                  label={
                    product.stock <= 3
                      ? `${product.stock}개 남음 · 마감임박`
                      : undefined
                  }
                />
              </div>
            )}

            {product.description && (
              <div className="border-l-4 border-green-500 pl-4 mb-6 text-lg text-ink-soft italic">
                "{product.description}"
              </div>
            )}

            {/* ── 안내 박스 ── */}
            <div className="bg-green-100 rounded-[14px] p-6 mb-8">
              <div className="font-bold text-green-700 text-sm mb-4">
                📦 배송 안내
              </div>
              <div className="space-y-2 text-sm text-ink">
                <p>
                  <strong>입금 방식:</strong> 무통장입금
                </p>
                <p>
                  <strong>발송 시기:</strong> 입금 확인 후 다음 날 발송
                </p>
                <p>
                  <strong>배송 지역:</strong> 전국 (제주/도서 제외)
                </p>
              </div>
            </div>

            {isSoldOut ? (
              <div className="w-full py-4 rounded-[12px] bg-ink text-white text-center font-bold opacity-50">
                현재 완판입니다
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link href={`/checkout?product=${id}`} className="w-full">
                  <Button variant="primary" size="lg" className="w-full">
                    주문하기
                  </Button>
                </Link>
                <Button variant="secondary" size="lg" className="w-full">
                  장바구니에 담기
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* ── 농부의 한마디 ── */}
        <div className="mt-24 border-t border-border pt-12">
          <h2 className="font-serif font-bold text-3xl text-ink mb-8">
            농부의 한마디
          </h2>
          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="flex-1 border-l-4 border-green-500 pl-6">
                <p className="text-lg text-ink-soft leading-relaxed italic">
                  "올해는 비가 적어 유독 단단하고 달답니다. 받으신 날 바로 쪄 드셔도 좋아요."
                </p>
              </div>
              <div className="w-48 rounded-2xl bg-gradient-to-br from-green-100 to-clay-100 flex items-center justify-center aspect-video text-sm text-ink-soft font-mono">
                현장 사진
              </div>
            </div>

            <div className="flex gap-6 items-start flex-row-reverse">
              <div className="flex-1 border-r-4 border-green-500 pr-6 text-right">
                <p className="text-lg text-ink-soft leading-relaxed italic">
                  "보관은 신문지에 싸서 그늘에 두세요. 이렇게 하면 2주까지 싱싱하답니다."
                </p>
              </div>
            </div>
          </div>
        </div>
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
