import { conAdmin } from "@/lib/admin-api"
import { leerTodo } from "@/lib/crm/datos"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/** Estado completo del CRM: lo usa el tablero para sincronizarse con los cambios de los demás. */
export async function GET() {
  return conAdmin(leerTodo)
}
