import { notFound } from "next/navigation";
import { getProduct } from "@/src/entities/product/api";
import { Header } from "@/src/shared/ui/Header";
import { formatPrice } from "@/src/shared/utils/format";
import { OrderButton } from "./OrderButton";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product || product.status === "hidden") notFound();

  const isSoldOut = product.status === "sold_out";

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-32 md:pb-12">
      <Header backHref="/products" backLabel="상품 목록" />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 md:py-10">
        {/* 이미지 */}
        <div
          className={`w-full aspect-square rounded-2xl overflow-hidden flex items-center justify-center mb-6 ${
            isSoldOut ? "bg-[#F5E8D5]" : "bg-[#D8EFE0]"
          }`}
        >
          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm text-[#B0A899]">사진 준비 중 📷</span>
          )}
        </div>

        {/* 상품 정보 */}
        <div className="mb-6">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h1 className="text-[#1C1C1C] text-xl md:text-2xl font-bold leading-snug">
              {product.name}
            </h1>
            {isSoldOut && (
              <span className="shrink-0 bg-[#EBEBEB] text-[#888] text-xs font-bold px-3 py-1 rounded-full mt-1">
                품절
              </span>
            )}
          </div>
          {product.description && (
            <p className="text-[#666] text-sm md:text-base leading-relaxed mb-4">
              {product.description}
            </p>
          )}
          <p className="text-[#D4813A] text-2xl md:text-3xl font-bold">
            {formatPrice(product.price)}
          </p>
          {!isSoldOut && (
            <p className="text-[#386144] text-sm mt-2">잔여 {product.stock}박스</p>
          )}
        </div>

        {/* 안내 */}
        <div className="bg-[#F5F5F0] rounded-2xl p-4 mb-6 text-sm text-[#666] space-y-1.5">
          <p>📦 고창 직송 · 주문 후 2~3일 내 발송</p>
          <p>💳 입금 확인 후 배송 시작</p>
          <p>📞 문의: 010-0000-0000</p>
        </div>

        {isSoldOut ? (
          <div className="w-full py-4 rounded-2xl bg-[#EBEBEB] text-[#999] text-center font-semibold">
            현재 품절입니다
          </div>
        ) : (
          <OrderButton productId={product.id} />
        )}
      </main>
    </div>
  );
}
