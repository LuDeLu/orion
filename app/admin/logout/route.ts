import { NextResponse, type NextRequest } from "next/server"
import { getAuthCookieName } from "@/lib/auth"

export const runtime = "nodejs"

export async function GET(req: NextRequest) {
  const res = NextResponse.redirect(new URL("/admin/login", req.url))
  res.cookies.set(getAuthCookieName(), "", { path: "/", maxAge: 0 })
  return res
}

export async function POST(req: NextRequest) {
  return GET(req)
}
