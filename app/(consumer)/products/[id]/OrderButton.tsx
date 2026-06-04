"use client";

import { useRouter } from "next/navigation";

export function OrderButton({ productId }: { productId: string }) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push(`/order?productId=${productId}`)}
      className="w-full py-4 rounded-2xl bg-[#386144] text-white font-bold text-base hover:bg-[#2d5038] active:scale-[0.98] transition-all"
    >
      주문하기
    </button>
  );
}
