import { conAdmin } from "@/lib/admin-api"
import { actualizarTarea, borrarComentario, borrarTarea, comentar } from "@/lib/crm/datos"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type Ctx = { params: Promise<{ id: string }> }

/** Cambios parciales. Comentarios: { comentario: "texto" } o { borrarComentario: "id" }. */
export async function PATCH(req: Request, { params }: Ctx) {
  return conAdmin(async (sesion) => {
    const { id } = await params
    const body = await req.json()
    if (typeof body.comentario === "string") return comentar(id, body.comentario, sesion.username)
    if (typeof body.borrarComentario === "string") return borrarComentario(id, body.borrarComentario)
    return actualizarTarea(id, body)
  })
}

export async function DELETE(_: Request, { params }: Ctx) {
  return conAdmin(async () => borrarTarea((await params).id))
}
