"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import {
  checkCredentials,
  getAuthCookieName,
  getSessionSecret,
  getSessionTTL,
  signSession,
} from "@/lib/auth"

export type LoginState = { error?: string }

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") || "").trim()
  const password = String(formData.get("password") || "")
  const from = String(formData.get("from") || "/admin")

  if (!username || !password) {
    return { error: "Completá usuario y contraseña" }
  }

  await new Promise((r) => setTimeout(r, 350))

  const ok = await checkCredentials(username, password)
  if (!ok) {
    return { error: "Credenciales inválidas" }
  }

  const token = await signSession(username, getSessionSecret())
  const jar = await cookies()
  jar.set(getAuthCookieName(), token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: getSessionTTL(),
  })

  redirect(from.startsWith("/admin") ? from : "/admin")
}
