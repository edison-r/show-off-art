import { type NextRequest } from "next/server";
import { refreshSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await refreshSession(request);
}

export const config = {
  matcher: ["/app/:path*"],
};
