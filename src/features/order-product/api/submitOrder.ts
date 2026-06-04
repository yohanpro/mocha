"use server";

import { createClient } from "@/src/shared/lib/supabase/server";

interface SubmitOrderInput {
  productId: string;
  qty: number;
  totalPrice: number;
  name: string;
  phone: string;
  address: string;
  memo?: string;
}

export async function submitOrder(input: SubmitOrderInput): Promise<{ orderId: string }> {
  const supabase = await createClient();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      product_id: input.productId,
      qty: input.qty,
      total_price: input.totalPrice,
      status: "pending",
    })
    .select("id")
    .single();

  if (orderError) throw new Error(orderError.message);

  const { error: customerError } = await supabase.from("customers").insert({
    order_id: order.id,
    name: input.name,
    phone: input.phone,
    address: input.address,
    memo: input.memo || null,
  });

  if (customerError) throw new Error(customerError.message);

  return { orderId: order.id };
}
