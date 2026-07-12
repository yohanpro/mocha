import { getOrders } from "@/src/entities/order/api";
import { OrderCard } from "@/src/entities/order/ui/OrderCard";
import { OrderStatusControl } from "@/src/features/manage-order/ui/OrderStatusControl";

export default async function AdminOrdersPage() {
  const orders = await getOrders();
  const pendingCount = orders.filter((o) => o.status === "pending").length;

  return (
    <main className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-4 flex items-baseline justify-between">
        <h1 className="text-lg font-bold">주문 관리</h1>
        <span className="text-sm text-muted-foreground">
          전체 {orders.length}건
          {pendingCount > 0 && ` · 입금대기 ${pendingCount}`}
        </span>
      </div>

      {orders.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          아직 주문이 없습니다.
        </p>
      ) : (
        <ul className="space-y-3">
          {orders.map((order) => (
            <li key={order.id}>
              <OrderCard order={order}>
                <OrderStatusControl orderId={order.id} status={order.status} />
              </OrderCard>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
