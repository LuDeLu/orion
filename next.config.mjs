/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    // Next exige declarar los valores de `quality` que usan los componentes,
    // incluso con unoptimized activo.
    qualities: [75, 95],
  },
}

export default nextConfig
