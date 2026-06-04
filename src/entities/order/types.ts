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
