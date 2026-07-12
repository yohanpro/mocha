"use server";

import { createClient } from "@/src/shared/lib/supabase/server";

interface SubmitOrderInput {
  productId: string;
  qty: number;
  name: string;
  phone: string;
  address: string;
  memo?: string;
}

// 주문 생성은 place_order RPC 한 번으로 처리한다(원자성 + 서버측 가격계산).
// 왜 여기서 total_price 를 안 받는지: 금액은 DB가 product_id 로 다시 계산한다.
// 클라이언트가 보낸 금액을 저장하면 조작 가능 → 신뢰 경계를 넘겨선 안 된다.
export async function submitOrder(input: SubmitOrderInput): Promise<{ orderId: string }> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("place_order", {
    p_product_id: input.productId,
    p_qty: input.qty,
    p_name: input.name,
    p_phone: input.phone,
    p_address: input.address,
    p_memo: input.memo ?? null,
  });

  if (error) throw new Error(error.message);

  return { orderId: data as string };
}
