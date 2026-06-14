export type OrderStatus = "pending" | "confirmed" | "shipped" | "done" | "cancelled";

export interface Order {
  id: string;
  product_id: string;
  qty: number;
  total_price: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  order_id: string;
  name: string;
  phone: string;
  address: string;
  memo: string | null;
}

// 관리자 주문 목록용 조인 뷰모델 (orders + products + customers)
export interface AdminOrder {
  id: string;
  qty: number;
  total_price: number;
  status: OrderStatus;
  created_at: string;
  product: { name: string; price: number } | null;
  customer: { name: string; phone: string; address: string; memo: string | null } | null;
}

// DB check 제약이 허용하는 상태 흐름 (cancelled 제외)
export const ORDER_FLOW = ["pending", "confirmed", "shipped", "done"] as const;

export const STATUS_META: Record<
  OrderStatus,
  { label: string; variant: "default" | "secondary" | "outline" | "soldout" }
> = {
  pending: { label: "입금대기", variant: "secondary" },
  confirmed: { label: "입금확인", variant: "default" },
  shipped: { label: "배송중", variant: "outline" },
  done: { label: "완료", variant: "soldout" },
  cancelled: { label: "취소", variant: "soldout" },
};

// 현재 상태에서 진행할 다음 단계 (없으면 마지막)
export const NEXT_STEP: Partial<Record<OrderStatus, { status: OrderStatus; label: string }>> = {
  pending: { status: "confirmed", label: "입금 확인" },
  confirmed: { status: "shipped", label: "발송 처리" },
  shipped: { status: "done", label: "완료 처리" },
};
