"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/src/shared/lib/supabase/server";
import { ORDER_FLOW, type OrderStatus } from "@/src/entities/order/types";

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  // DB check 제약과 동일한 상태만 허용 (방어). 통과 시 4개 흐름 상태로 좁혀짐.
  if (!(ORDER_FLOW as readonly string[]).includes(status)) {
    throw new Error(`허용되지 않은 상태: ${status}`);
  }
  const flowStatus = status as (typeof ORDER_FLOW)[number];

  const supabase = await createClient();
  const { error } = await supabase
    .from("orders")
    .update({ status: flowStatus })
    .eq("id", orderId);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/orders");
}
