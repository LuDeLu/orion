import { leerTodo } from "@/lib/crm/datos"
import { CrmApp } from "@/components/admin/crm/crm-app"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export const metadata = { title: "CRM · Orion" }

export default async function CrmPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const [datos, sp] = await Promise.all([leerTodo(), searchParams])
  return (
    <div className="space-y-5">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.35em] mb-1" style={{ color: "rgba(219,172,52,0.70)" }}>Clientes y tareas</p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">CRM</h1>
      </div>
      <CrmApp inicial={datos} query={new URLSearchParams(sp).toString()} />
    </div>
  )
}
