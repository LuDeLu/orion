"use client"

const stats = [
  { value: "5+", label: "Proyectos completados" },
  { value: "100%", label: "Clientes satisfechos" },
  { value: "2x", label: "ROI promedio" },
  { value: "24/7", label: "Soporte disponible" },
]

export function Stats() {
  return (
    <section className="relative py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
