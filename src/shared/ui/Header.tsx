import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface HeaderProps {
  activeNav?: "home" | "products" | "feed" | "order";
  backHref?: string;
  backLabel?: string;
  title?: string;
}

const NAV = [
  { label: "상품", href: "/products", key: "products" },
  { label: "일상", href: "/feed", key: "feed" },
  { label: "주문 확인", href: "/order", key: "order" },
] as const;

export function Header({ activeNav, backHref, backLabel, title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 flex items-center h-[52px] gap-2">

        {backHref ? (
          <>
            <Link
              href={backHref}
              className="flex items-center gap-0.5 text-foreground/70 hover:text-foreground transition-colors -ml-1"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">{backLabel ?? "뒤로"}</span>
            </Link>
            {title && (
              <span className="text-[15px] font-bold text-foreground mx-auto pr-14">
                {title}
              </span>
            )}
          </>
        ) : (
          <>
            <Link href="/" className="text-primary font-bold text-[17px] tracking-tight">
              콜리네 텃밭
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground ml-auto">
              {NAV.map((n) => (
                <Link
                  key={n.key}
                  href={n.href}
                  className={
                    activeNav === n.key
                      ? "text-foreground font-semibold"
                      : "hover:text-foreground transition-colors"
                  }
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </>
        )}
      </div>
    </header>
  );
}
