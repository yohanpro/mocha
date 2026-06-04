import Link from "next/link";

type NavKey = "home" | "products" | "feed" | "order";

const ITEMS = [
  { label: "홈", href: "/", key: "home" },
  { label: "상품", href: "/products", key: "products" },
  { label: "일상", href: "/feed", key: "feed" },
  { label: "주문", href: "/order", key: "order" },
] as const;

export function BottomNav({ active }: { active: NavKey }) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8E2D9] z-10">
      <div className="grid grid-cols-4 h-16">
        {ITEMS.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors ${
              active === item.key ? "text-[#386144]" : "text-[#B0A899]"
            }`}
          >
            {active === item.key && (
              <div className="w-5 h-0.5 rounded-full bg-[#386144] -mb-0.5" />
            )}
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
