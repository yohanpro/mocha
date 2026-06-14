import { Badge } from "@/shared/ui/badge";
import { formatPrice, formatDate } from "@/src/shared/utils/format";
import { STATUS_META, type AdminOrder } from "../types";

// 표시 전용. 상태 변경 등 액션은 children 슬롯으로 주입 (features → entities 단방향 유지).
export function OrderCard({
  order,
  children,
}: {
  order: AdminOrder;
  children?: React.ReactNode;
}) {
  const meta = STATUS_META[order.status];

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold">{order.product?.name ?? "(삭제된 상품)"}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {order.qty}개 · {formatPrice(order.total_price)}
          </p>
        </div>
        <Badge variant={meta.variant}>{meta.label}</Badge>
      </div>

      {order.customer && (
        <dl className="mt-3 space-y-1 border-t border-border pt-3 text-sm">
          <div className="flex gap-2">
            <dt className="w-12 shrink-0 text-muted-foreground">주문자</dt>
            <dd>{order.customer.name}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-12 shrink-0 text-muted-foreground">연락처</dt>
            <dd>{order.customer.phone}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-12 shrink-0 text-muted-foreground">배송지</dt>
            <dd>{order.customer.address}</dd>
          </div>
          {order.customer.memo && (
            <div className="flex gap-2">
              <dt className="w-12 shrink-0 text-muted-foreground">메모</dt>
              <dd>{order.customer.memo}</dd>
            </div>
          )}
        </dl>
      )}

      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
        <span className="text-xs text-muted-foreground">
          {formatDate(order.created_at)}
        </span>
        {children}
      </div>
    </div>
  );
}
