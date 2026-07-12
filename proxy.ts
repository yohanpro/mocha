import { type NextRequest } from "next/server";
import { updateSession } from "@/src/shared/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: ["/admin/dashboard/:path*", "/admin/login"],
};
