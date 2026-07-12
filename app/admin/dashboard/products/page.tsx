import Link from "next/link";
import { Plus, Package } from "lucide-react";
import { getAllProducts } from "@/src/entities/product/api";
import { PRODUCT_STATUS_META } from "@/src/entities/product/types";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { formatPrice } from "@/src/shared/utils/format";

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return (
    <main className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-bold">상품 관리</h1>
        <Button asChild size="sm">
          <Link href="/admin/dashboard/products/new">
            <Plus className="size-4" />새 상품
          </Link>
        </Button>
      </div>

      {products.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          등록된 상품이 없습니다.
        </p>
      ) : (
        <ul className="space-y-2">
          {products.map((p) => {
            const meta = PRODUCT_STATUS_META[p.status];
            return (
              <li key={p.id}>
                <Link
                  href={`/admin/dashboard/products/${p.id}`}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:border-[#C8C2B9]"
                >
                  <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary">
                    {p.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image_url} alt={p.name} className="size-full object-cover" />
                    ) : (
                      <Package className="size-6 text-muted-foreground/30" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{p.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(p.price)} · 재고 {p.stock}
                    </p>
                  </div>
                  <Badge variant={meta.variant}>{meta.label}</Badge>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
