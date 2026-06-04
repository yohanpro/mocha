"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/src/shared/utils/format";
import { submitOrder } from "../api/submitOrder";
import type { Product } from "@/src/entities/product/types";

interface OrderFormState {
  orderId?: string;
  error?: string;
}

export function OrderForm({ product }: { product: Product }) {
  const router = useRouter();

  const [qty, setQty] = useState(1);

  const action = async (_prev: OrderFormState, formData: FormData): Promise<OrderFormState> => {
    try {
      const { orderId } = await submitOrder({
        productId: product.id,
        qty,
        totalPrice: product.price * qty,
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

  // 주문 완료 → 완료 화면
  if (state.orderId) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-[#1C1C1C] text-2xl font-bold mb-2">주문이 접수됐어요!</h1>
          <p className="text-[#666] text-sm mb-8">
            아래 계좌로 입금해주시면 확인 후 바로 배송해드릴게요.
          </p>

          <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm text-left">
            <p className="text-xs text-[#B0A899] mb-3 font-medium">입금 계좌</p>
            <p className="text-[#1C1C1C] font-bold text-lg mb-1">농협 000-0000-0000-00</p>
            <p className="text-[#555] text-sm mb-1">예금주: 김○○</p>
            <div className="border-t border-[#F0EDE8] mt-3 pt-3">
              <p className="text-[#D4813A] font-bold text-xl">
                {formatPrice(product.price * qty)}
              </p>
              <p className="text-[#888] text-xs mt-0.5">
                {product.name} × {qty}박스
              </p>
            </div>
          </div>

          <p className="text-[#888] text-xs mb-8">
            주문번호: {state.orderId.slice(0, 8).toUpperCase()}
          </p>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="w-full py-3.5 rounded-2xl bg-[#386144] text-white font-bold text-sm hover:bg-[#2d5038] transition-colors"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-32">
      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* 주문 상품 요약 */}
        <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
          <p className="text-xs text-[#B0A899] mb-2 font-medium">주문 상품</p>
          <p className="font-bold text-[#1C1C1C]">{product.name}</p>
          <p className="text-[#D4813A] font-semibold mt-1">{formatPrice(product.price)} / 박스</p>

          <div className="flex items-center gap-3 mt-4">
            <p className="text-sm text-[#555]">수량</p>
            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-full bg-[#F0EDE8] flex items-center justify-center text-[#555] font-bold"
              >
                −
              </button>
              <span className="w-6 text-center font-bold text-[#1C1C1C]">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                className="w-8 h-8 rounded-full bg-[#D8EFE0] flex items-center justify-center text-[#386144] font-bold"
              >
                +
              </button>
            </div>
          </div>

          <div className="border-t border-[#F0EDE8] mt-4 pt-4 flex justify-between">
            <span className="text-sm text-[#555]">합계</span>
            <span className="font-bold text-[#D4813A]">{formatPrice(product.price * qty)}</span>
          </div>
        </div>

        <form action={formAction} className="space-y-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
            <p className="text-xs text-[#B0A899] font-medium">배송 정보</p>

            {[
              { label: "이름", name: "name", type: "text", placeholder: "홍길동" },
              { label: "연락처", name: "phone", type: "tel", placeholder: "010-0000-0000" },
              { label: "주소", name: "address", type: "text", placeholder: "서울시 마포구 합정동 123-4" },
            ].map((f) => (
              <div key={f.name}>
                <label className="text-sm font-medium text-[#1C1C1C] block mb-1.5">{f.label}</label>
                <input
                  type={f.type}
                  name={f.name}
                  placeholder={f.placeholder}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E2D9] bg-[#FAF7F2] text-[#1C1C1C] placeholder-[#C0BAB2] text-sm focus:outline-none focus:border-[#386144] transition-colors"
                />
              </div>
            ))}

            <div>
              <label className="text-sm font-medium text-[#1C1C1C] block mb-1.5">
                배송 메모 <span className="text-[#B0A899] font-normal">(선택)</span>
              </label>
              <textarea
                name="memo"
                placeholder="문 앞에 놓아주세요"
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-[#E8E2D9] bg-[#FAF7F2] text-[#1C1C1C] placeholder-[#C0BAB2] text-sm focus:outline-none focus:border-[#386144] transition-colors resize-none"
              />
            </div>
          </div>

          {state.error && (
            <p className="text-red-500 text-sm px-1">{state.error}</p>
          )}

          <div className="bg-[#FFF8F0] border border-[#F5E0C0] rounded-2xl p-4 text-sm text-[#9C7040] space-y-1">
            <p className="font-semibold mb-1">💳 결제 안내</p>
            <p>주문 접수 후 계좌이체로 결제합니다.</p>
            <p>입금 확인 후 1~2일 내 발송됩니다.</p>
          </div>

          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8E2D9] p-4 md:static md:border-0 md:bg-transparent md:p-0">
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 rounded-2xl bg-[#386144] text-white font-bold text-base hover:bg-[#2d5038] active:scale-[0.98] transition-all disabled:opacity-60"
            >
              {isPending ? "주문 처리 중..." : `${formatPrice(product.price * qty)} 주문하기`}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

