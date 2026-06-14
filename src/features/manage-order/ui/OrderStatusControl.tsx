"use client";

import { useTransition } from "react";
import { Button } from "@/shared/ui/button";
import { NEXT_STEP, type OrderStatus } from "@/src/entities/order/types";
import { updateOrderStatus } from "../api/updateOrderStatus";

export function OrderStatusControl({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus;
}) {
  const [pending, startTransition] = useTransition();
  const next = NEXT_STEP[status];

  if (!next) {
    return <span className="text-xs text-muted-foreground">처리 완료</span>;
  }

  return (
    <Button
      size="sm"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await updateOrderStatus(orderId, next.status);
        })
      }
    >
      {pending ? "처리 중…" : next.label}
    </Button>
  );
}
