import { NextResponse, type NextRequest } from "next/server"
import { getAuthCookieName, getSessionSecret, verifySession } from "@/lib/auth"

export const config = {
  matcher: ["/admin/:path*"],
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname === "/admin/login" || pathname === "/admin/logout") {
    return NextResponse.next()
  }

  const token = req.cookies.get(getAuthCookieName())?.value
  const session = await verifySession(token, getSessionSecret())
  if (session) return NextResponse.next()

  const loginUrl = new URL("/admin/login", req.url)
  if (pathname !== "/admin") loginUrl.searchParams.set("from", pathname)
  return NextResponse.redirect(loginUrl)
}
