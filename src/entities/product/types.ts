export type ProductStatus = "active" | "sold_out" | "hidden";

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  status: ProductStatus;
  created_at: string;
  updated_at: string;
}

export const PRODUCT_STATUS_META: Record<
  ProductStatus,
  { label: string; variant: "default" | "secondary" | "soldout" }
> = {
  active: { label: "판매중", variant: "default" },
  sold_out: { label: "품절", variant: "soldout" },
  hidden: { label: "숨김", variant: "secondary" },
};
