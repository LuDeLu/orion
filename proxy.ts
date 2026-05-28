import { NextResponse, type NextRequest } from "next/server"
import { getAuthCookieName, getSessionSecret, verifySession } from "@/lib/auth"

// Restringir el proxy a /admin/* exclusivamente. Cualquier otra ruta queda
// completamente fuera de su alcance (la home, /qr, /api/*, /gracias, etc.).
export const config = {
  matcher: ["/admin", "/admin/:path*"],
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Defensa adicional por si el matcher se evalúa más permisivo de lo esperado
  // en algún edge case de Next 16: si la URL no empieza con /admin, no toca nada.
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next()
  }

  // Login y logout siempre accesibles
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
