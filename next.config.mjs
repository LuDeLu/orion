/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // react-pdf trae binarios (fuentes, yoga) que no conviene empaquetar
  serverExternalPackages: ["@react-pdf/renderer"],
  // El PDF lee el logo del disco: hay que incluirlo en las funciones de Vercel
  outputFileTracingIncludes: {
    "/admin/facturacion/[id]/pdf": ["./public/logohorizontal.png"],
    "/api/admin/facturacion/vista-previa": ["./public/logohorizontal.png"],
  },
  images: {
    unoptimized: true,
    // Next exige declarar los valores de `quality` que usan los componentes,
    // incluso con unoptimized activo.
    qualities: [75, 95],
  },
}

export default nextConfig
