import React from "react";

interface StockBadgeProps {
  stock: number;
  label?: string;
}

export function StockBadge({ stock, label }: StockBadgeProps) {
  if (stock === 0) {
    return (
      <div className="inline-flex items-center gap-1">
        <span className="bg-ink text-white text-xs font-bold px-3 py-1 rounded-full">
          완판
        </span>
        <span className="text-xs text-ink-soft">다음 주 재입고</span>
      </div>
    );
  }

  const isLow = stock <= 3;
  const badgeColor = isLow ? "bg-clay-600 text-clay-600" : "bg-green-600 text-green-600";

  return (
    <div className="inline-flex items-center gap-1">
      <span className={`${badgeColor.split(" ")[0]} w-2 h-2 rounded-full`} />
      <span className={`font-mono font-bold text-sm ${badgeColor.split(" ")[1]}`}>
        {label || (isLow ? `${stock}개 남음` : `재고 ${stock}개`)}
      </span>
      {isLow && <span className="text-xs text-ink-soft">· 마감임박</span>}
    </div>
  );
}
