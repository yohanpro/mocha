"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { submitOrder } from "../api/submitOrder";
import { Button } from "@/components/Button";
import type { Product } from "@/src/entities/product/types";

interface OrderFormState {
  orderId?: string;
  error?: string;
}

export function OrderForm({ product }: { product: Product }) {
  const router = useRouter();
  const [qty, setQty] = useState(1);

  const action = async (
    _prev: OrderFormState,
    formData: FormData
  ): Promise<OrderFormState> => {
    try {
      const { orderId } = await submitOrder({
        productId: product.id,
        qty,
        name: formData.get("name") as string,
        phone: formData.get("phone") as string,
        address: formData.get("address") as string,
        memo: formData.get("memo") as string,
      });
      return { orderId };
    } catch (e) {
      return { error: (e as Error).message };
    }
  };

  const [state, formAction, isPending] = useActionState(action, {});

  if (state.orderId) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-8">🎉</div>
          <h1 className="font-serif font-bold text-3xl text-ink mb-4">
            주문이 접수됐어요!
          </h1>
          <p className="text-ink-soft text-base mb-12 leading-relaxed">
            아래 계좌로 입금해주시면 확인 후 다음 날 배송해드릴게요.
          </p>

          <div className="bg-white rounded-2xl p-8 mb-8 border border-border">
            <div className="text-sm text-ink-soft font-mono mb-3">무통장입금 안내</div>
            <div className="font-mono font-bold text-xl text-green-700 mb-2">
              농협 352-0000-0000-00
            </div>
            <div className="text-sm text-ink-soft mb-6">
              예금주 콜리네텃밭
            </div>

            <div className="border-t border-border pt-6">
              <div className="font-mono font-bold text-2xl text-ink mb-2">
                {(product.price * qty).toLocaleString()}원
              </div>
              <div className="text-sm text-ink-soft">
                {product.name} × {qty}개
              </div>
            </div>
          </div>

          <div className="bg-green-100 rounded-xl px-4 py-3 mb-8">
            <div className="font-mono text-sm text-green-700">
              주문번호: {state.orderId.slice(0, 8).toUpperCase()}
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={() => router.push("/")}
          >
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper pb-40 md:pb-12">
      <header className="sticky top-0 z-20 bg-white border-b border-border px-4 md:px-8 py-4 flex items-center">
        <Link href={`/products/${product.id}`} className="text-ink-soft hover:text-ink transition font-bold">
          ← 상품보기
        </Link>
        <span className="font-serif font-bold text-2xl text-green-700 mx-auto">
          주문서
        </span>
        <div className="w-16" />
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        <form action={formAction} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── 주문 정보 ── */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="font-serif font-bold text-2xl text-ink mb-6">
                배송 정보
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    label: "받는 분",
                    name: "name",
                    type: "text",
                    placeholder: "홍길동",
                  },
                  {
                    label: "연락처",
                    name: "phone",
                    type: "tel",
                    placeholder: "010-0000-0000",
                  },
                  {
                    label: "배송지",
                    name: "address",
                    type: "text",
                    placeholder: "도로명 주소를 입력하세요",
                    className: "col-span-2",
                  },
                  {
                    label: "배송 메모 (선택)",
                    name: "memo",
                    type: "textarea",
                    placeholder: "부재 시 문 앞에 놓아주세요",
                    className: "col-span-2",
                  },
                ].map((field) => (
                  <div key={field.name} className={field.className || ""}>
                    <label className="text-sm font-bold text-ink block mb-2">
                      {field.label}
                    </label>
                    {field.type === "textarea" ? (
                      <textarea
                        name={field.name}
                        placeholder={field.placeholder}
                        rows={3}
                        className="w-full px-4 py-3 rounded-[12px] border-2 border-border bg-white text-ink placeholder-ink-soft text-sm focus:outline-none focus:border-green-600 transition-colors"
                      />
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        placeholder={field.placeholder}
                        required
                        className="w-full px-4 py-3 rounded-[12px] border-2 border-border bg-white text-ink placeholder-ink-soft text-sm focus:outline-none focus:border-green-600 transition-colors"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── 주문 요약 ── */}
          <div className="lg:sticky lg:top-24 h-fit space-y-6">
            <div className="bg-white rounded-2xl border-2 border-border p-6">
              <div className="font-serif font-bold text-lg text-ink mb-6">
                주문 요약
              </div>

              {/* 상품 */}
              <div className="flex gap-4 mb-6">
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-green-100 to-clay-100 flex-shrink-0 flex items-center justify-center text-xs text-ink-soft">
                  사진
                </div>
                <div className="flex-1">
                  <div className="font-bold text-ink mb-1">{product.name}</div>
                  <div className="font-mono text-sm text-ink-soft">
                    {product.price.toLocaleString()}원
                  </div>
                </div>
              </div>

              {/* 수량 */}
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-border">
                <span className="text-sm text-ink-soft">수량</span>
                <div className="flex items-center gap-3 border-2 border-border rounded-[10px] px-4 py-2">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="text-xl font-bold text-green-600 hover:text-green-700"
                  >
                    −
                  </button>
                  <span className="font-mono font-bold text-ink w-6 text-center">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => q + 1)}
                    className="text-xl font-bold text-green-600 hover:text-green-700"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* 입금 안내 */}
              <div className="bg-green-100 rounded-[14px] p-4 mb-6">
                <div className="font-bold text-green-700 text-sm mb-2">
                  무통장입금 안내
                </div>
                <div className="font-mono font-bold text-sm text-green-700 mb-1">
                  농협 352-0000-0000-00
                </div>
                <div className="text-xs text-green-600">
                  예금주 콜리네텃밭
                </div>
              </div>

              {/* 합계 */}
              <div className="pt-6 border-t border-border">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-ink-soft">총 결제금액</span>
                  <div className="font-mono font-bold text-2xl text-ink">
                    {(product.price * qty).toLocaleString()}원
                  </div>
                </div>
              </div>
            </div>

            {state.error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">
                {state.error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isPending}
              className="w-full"
            >
              {isPending ? "주문 처리 중..." : "주문 완료하기"}
            </Button>
            <p className="text-xs text-center text-ink-soft leading-relaxed">
              입금이 확인되면 다음 날 발송됩니다.
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}

