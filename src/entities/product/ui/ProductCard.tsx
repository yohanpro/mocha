import Link from "next/link";
import { Package } from "lucide-react";
import { formatPrice } from "@/src/shared/utils/format";
import { cn } from "@/src/shared/utils/cn";
import type { Product } from "../types";

export function ProductCard({ product: p }: { product: Product }) {
  const isSoldOut = p.status === "sold_out";

  return (
    <Link
      href={isSoldOut ? "#" : `/products/${p.id}`}
      className={cn(isSoldOut && "pointer-events-none")}
    >
      <div
        className={cn(
          "bg-card rounded-xl border border-border overflow-hidden transition-all",
          isSoldOut ? "opacity-60" : "hover:border-[#C8C2B9] active:scale-[0.98]",
        )}
      >
        {/* 이미지 — 정사각형 */}
        <div className="relative w-full aspect-square overflow-hidden bg-secondary">
          {p.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-10 h-10 text-muted-foreground/30" />
            </div>
          )}
          {isSoldOut && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <span className="text-xs font-bold text-white bg-black/60 px-3 py-1 rounded-full">
                품절
              </span>
            </div>
          )}
        </div>

        {/* 정보 */}
        <div className="p-3">
          <p className="text-sm font-medium text-foreground line-clamp-2 mb-1 leading-snug">
            {p.name}
          </p>
          {/* 가격 — 당근식 bold 검정 */}
          <p className={cn("text-[15px] font-bold", isSoldOut ? "text-muted-foreground" : "text-foreground")}>
            {formatPrice(p.price)}
          </p>
          <div className="mt-1.5">
            {isSoldOut ? (
              <span className="text-[11px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                품절
              </span>
            ) : (
              <span className="text-[11px] font-medium text-primary bg-secondary px-2 py-0.5 rounded-full">
                잔여 {p.stock}박스
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
