import { redirect } from "next/navigation";
import { createClient } from "@/src/shared/lib/supabase/server";
import { logout } from "../login/actions";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // proxy로 1차 보호되지만, 서버 렌더 시점에도 방어
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
        <span className="text-sm font-semibold">콜리네 관리자</span>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>{user.email}</span>
          <form action={logout}>
            <button type="submit" className="text-foreground hover:underline">
              로그아웃
            </button>
          </form>
        </div>
      </header>
      {children}
    </div>
  );
}
