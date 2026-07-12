import Link from "next/link";
import {
  Wallet,
  Truck,
  CheckCircle2,
  ClipboardList,
  Package,
  Newspaper,
  ChevronRight,
} from "lucide-react";
import { getOrders } from "@/src/entities/order/api";
import { getAllProducts } from "@/src/entities/product/api";
import { getAllPosts } from "@/src/entities/post/api";

export default async function DashboardHomePage() {
  // 홈 진입 1회 조회로 요약 카운트 산출 (별도 count 쿼리 없이 기존 조회 재사용).
  const [orders, products, posts] = await Promise.all([
    getOrders(),
    getAllProducts(),
    getAllPosts(),
  ]);

  const pending = orders.filter((o) => o.status === "pending").length; // 입금 확인 대기
  const toShip = orders.filter((o) => o.status === "confirmed").length; // 발송 대기
  const soldOut = products.filter((p) => p.status === "sold_out").length;
  const todo = pending + toShip;

  return (
    <main className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-1 text-lg font-bold">관리자 홈</h1>
      <p className="mb-5 text-sm text-muted-foreground">오늘 처리할 일을 먼저 확인하세요.</p>

      {/* 오늘 처리할 일 — 운영자가 놓치면 손해 나는 흐름을 최상단에 */}
      {todo === 0 ? (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-border bg-card p-4">
          <CheckCircle2 className="size-6 shrink-0 text-primary" />
          <div>
            <p className="font-medium">처리할 주문이 없어요 👍</p>
            <p className="text-sm text-muted-foreground">새 주문이 들어오면 여기에 표시됩니다.</p>
          </div>
        </div>
      ) : (
        <div className="mb-6 grid grid-cols-2 gap-3">
          <TodoCard
            href="/admin/dashboard/orders"
            icon={<Wallet className="size-5" />}
            count={pending}
            label="입금 확인 대기"
            hint="입금 내역 확인 후 확정"
            urgent
          />
          <TodoCard
            href="/admin/dashboard/orders"
            icon={<Truck className="size-5" />}
            count={toShip}
            label="발송 대기"
            hint="입금 확정된 주문 배송"
          />
        </div>
      )}

      {/* 바로가기 — 대시보드 섹션 이동 허브 */}
      <p className="mb-2 text-xs font-semibold text-muted-foreground">바로가기</p>
      <ul className="space-y-2">
        <NavCard
          href="/admin/dashboard/orders"
          icon={<ClipboardList className="size-5 text-primary" />}
          title="주문 관리"
          desc={`전체 ${orders.length}건`}
        />
        <NavCard
          href="/admin/dashboard/products"
          icon={<Package className="size-5 text-primary" />}
          title="상품 관리"
          desc={soldOut > 0 ? `${products.length}개 · 품절 ${soldOut}` : `${products.length}개`}
        />
        <NavCard
          href="/admin/dashboard/feed"
          icon={<Newspaper className="size-5 text-primary" />}
          title="피드 관리"
          desc={`게시글 ${posts.length}개`}
        />
      </ul>
    </main>
  );
}

function TodoCard({
  href,
  icon,
  count,
  label,
  hint,
  urgent = false,
}: {
  href: string;
  icon: React.ReactNode;
  count: number;
  label: string;
  hint: string;
  urgent?: boolean;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-1 rounded-xl border border-border bg-card p-4 transition-colors hover:border-[#C8C2B9]"
    >
      <span className={urgent && count > 0 ? "text-primary" : "text-muted-foreground"}>{icon}</span>
      <span className="text-2xl font-bold tabular-nums">{count}</span>
      <span className="text-sm font-medium">{label}</span>
      <span className="text-xs text-muted-foreground">{hint}</span>
    </Link>
  );
}

function NavCard({
  href,
  icon,
  title,
  desc,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:border-[#C8C2B9]"
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">{desc}</p>
        </div>
        <ChevronRight className="size-5 text-muted-foreground/40" />
      </Link>
    </li>
  );
}
