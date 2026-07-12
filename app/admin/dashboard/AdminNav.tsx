"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ClipboardList, Package, Newspaper, Sprout, LogOut } from "lucide-react";
import { logout } from "../login/actions";

const ITEMS = [
  { href: "/admin/dashboard", label: "홈", icon: Home, exact: true },
  { href: "/admin/dashboard/orders", label: "주문", icon: ClipboardList },
  { href: "/admin/dashboard/products", label: "상품", icon: Package },
  { href: "/admin/dashboard/feed", label: "피드", icon: Newspaper },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  return exact ? pathname === href : pathname.startsWith(href);
}

export function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <>
      {/* 데스크톱: 좌측 고정 사이드바 */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-border bg-card md:flex">
        <div className="flex items-center gap-2 px-5 py-5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Sprout className="size-5" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-bold">콜리네 텃밭</p>
            <p className="text-xs text-muted-foreground">관리자</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {ITEMS.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(pathname, href, exact);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-secondary font-semibold text-primary"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                }`}
              >
                <Icon className="size-[18px]" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-3">
          <p className="truncate px-2 pb-2 text-xs text-muted-foreground">{email}</p>
          <form action={logout}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
            >
              <LogOut className="size-[18px]" />
              로그아웃
            </button>
          </form>
        </div>
      </aside>

      {/* 모바일: 상단바 + 가로 스크롤 네비 */}
      <header className="sticky top-0 z-10 border-b border-border bg-card md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sprout className="size-4" />
            </span>
            <span className="text-sm font-bold">콜리네 관리자</span>
          </div>
          <form action={logout}>
            <button
              type="submit"
              aria-label="로그아웃"
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="size-5" />
            </button>
          </form>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-2 pb-2">
          {ITEMS.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(pathname, href, exact);
            return (
              <Link
                key={href}
                href={href}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? "bg-secondary font-semibold text-primary"
                    : "text-muted-foreground hover:bg-secondary/60"
                }`}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </header>
    </>
  );
}
