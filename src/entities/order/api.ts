import { createClient } from "@/src/shared/lib/supabase/server";
import type { AdminOrder, OrderStatus } from "./types";

// Database 타입의 Relationships 가 비어 있어 supabase-js 가 조인을 추론하지 못한다.
// 런타임 조인은 정상이므로 .returns<>() 로 실제 응답 형태를 명시한다.
interface OrderJoinRow {
  id: string;
  qty: number;
  total_price: number;
  status: OrderStatus;
  created_at: string;
  products: { name: string; price: number } | null;
  customers: { name: string; phone: string; address: string; memo: string | null }[];
}

// 관리자 주문 목록 — orders + products + customers 조인.
// RLS: orders/customers select 는 authenticated(관리자)만 허용.
export async function getOrders(): Promise<AdminOrder[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, qty, total_price, status, created_at, products(name, price), customers(name, phone, address, memo)",
    )
    .order("created_at", { ascending: false })
    .returns<OrderJoinRow[]>();

  if (error) throw error;

  // customers 는 역방향 FK라 배열로 온다 → 1주문 1고객이므로 첫 요소만 사용
  return (data ?? []).map((row) => ({
    id: row.id,
    qty: row.qty,
    total_price: row.total_price,
    status: row.status,
    created_at: row.created_at,
    product: row.products ?? null,
    customer: row.customers?.[0] ?? null,
  }));
}
