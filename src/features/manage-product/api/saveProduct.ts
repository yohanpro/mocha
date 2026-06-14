"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/src/shared/lib/supabase/server";
import type { ProductStatus } from "@/src/entities/product/types";

export interface ProductFormState {
  error: string | null;
}

const STATUSES = ["active", "sold_out", "hidden"] as const;

// create/edit 통합 — formData에 id가 있으면 수정, 없으면 등록.
export async function saveProduct(
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const imageUrl = String(formData.get("image_url") ?? "").trim();
  const status = String(formData.get("status") ?? "active");
  const price = Number(formData.get("price"));
  const stock = Number(formData.get("stock"));

  if (!name) return { error: "상품명을 입력하세요." };
  if (!Number.isFinite(price) || price < 0) return { error: "가격을 0 이상으로 입력하세요." };
  if (!Number.isFinite(stock) || stock < 0) return { error: "재고를 0 이상으로 입력하세요." };
  if (!STATUSES.includes(status as (typeof STATUSES)[number])) {
    return { error: "잘못된 상태값입니다." };
  }

  const row = {
    name,
    description: description || null,
    image_url: imageUrl || null,
    status: status as ProductStatus,
    price: Math.round(price),
    stock: Math.round(stock),
  };

  const supabase = await createClient();
  const { error } = id
    ? await supabase.from("products").update(row).eq("id", id)
    : await supabase.from("products").insert(row);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
}
