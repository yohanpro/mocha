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
