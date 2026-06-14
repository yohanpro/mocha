"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import type { Product } from "@/src/entities/product/types";
import { saveProduct, type ProductFormState } from "../api/saveProduct";

const initialState: ProductFormState = { error: null };

// product 가 있으면 수정, 없으면 등록.
export function ProductForm({ product }: { product?: Product }) {
  const [state, formAction, pending] = useActionState(saveProduct, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {product && <input type="hidden" name="id" value={product.id} />}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">상품명</Label>
        <Input id="name" name="name" required defaultValue={product?.name} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">설명</Label>
        <Textarea id="description" name="description" defaultValue={product?.description ?? ""} />
      </div>

      <div className="flex gap-3">
        <div className="flex flex-1 flex-col gap-1.5">
          <Label htmlFor="price">가격 (원)</Label>
          <Input id="price" name="price" type="number" min={0} required defaultValue={product?.price} />
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <Label htmlFor="stock">재고</Label>
          <Input id="stock" name="stock" type="number" min={0} required defaultValue={product?.stock ?? 0} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="status">상태</Label>
        <select
          id="status"
          name="status"
          defaultValue={product?.status ?? "active"}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="active">판매중</option>
          <option value="sold_out">품절</option>
          <option value="hidden">숨김</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="image_url">이미지 URL</Label>
        <Input
          id="image_url"
          name="image_url"
          type="url"
          placeholder="https://…"
          defaultValue={product?.image_url ?? ""}
        />
      </div>

      {state.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}

      <div className="mt-2 flex gap-2">
        <Button type="submit" disabled={pending} className="flex-1">
          {pending ? "저장 중…" : product ? "수정 저장" : "상품 등록"}
        </Button>
        <Button asChild variant="outline" type="button">
          <Link href="/dashboard/products">취소</Link>
        </Button>
      </div>
    </form>
  );
}
