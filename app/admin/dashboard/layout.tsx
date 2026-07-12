import { redirect } from "next/navigation";
import { createClient } from "@/src/shared/lib/supabase/server";
import { AdminNav } from "./AdminNav";

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
  if (!user) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-[#FAF7F2] md:flex">
      <AdminNav email={user.email ?? ""} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
