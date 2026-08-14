/**
 * Normaliza los logos de clientes para el muro de marcas:
 *  - saca el fondo sólido (los que vienen sin canal alpha)
 *  - recorta el aire sobrante
 *  - escala con peso óptico parejo sobre un lienzo 600x200 transparente
 * Salida: public/logos/clean/<nombre>.webp  (los originales no se tocan)
 */
const sharp = require("sharp")
const fs = require("fs")
const path = require("path")

const SRC = "public/logos"
const OUT = "public/logos/clean"

// Colores de fondo a remover por logo (los que no tienen alpha).
const KEYS = {
  "Cmvet.webp": [
    { rgb: [0, 173, 181], tol: 110, feather: 1 }, // fondo turquesa (se lleva la bajada del mismo tono)
    { rgb: [255, 255, 255], tol: 72, feather: 1 }, // rombo blanco
  ],
  "I51.webp": [{ rgb: [0, 0, 0], tol: 60 }],
  "Rrsintetico.webp": [{ rgb: [45, 54, 28], tol: 70 }],
}

const files = [
  "vittal.webp",
  "Adn.webp",
  "scheppens.webp",
  "Cmvet.webp",
  "Plotchain.webp",
  "Rrsintetico.webp",
  "Soulsecurity.webp",
  "I51.webp",
]

const BOX_W = 600
const BOX_H = 200

// Recortes previos: se queda solo con la parte legible del logo.
const CROPS = {
  // CMVet viene como isologo dentro de un rombo: nos quedamos con el lettering.
  "Cmvet.webp": { left: 165, top: 230, width: 270, height: 150 },
  // El sello de Soul Security es una forma maciza: en silueta queda un borrón.
  "Soulsecurity.webp": { left: 258, top: 75, width: 342, height: 130 },
}

async function keyOut(file) {
  const crop = CROPS[file]
  const img = crop
    ? sharp(path.join(SRC, file)).extract(crop).ensureAlpha()
    : sharp(path.join(SRC, file)).ensureAlpha()
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true })
  const keys = KEYS[file]
  if (keys) {
    for (let i = 0; i < data.length; i += info.channels) {
      for (const k of keys) {
        const d = Math.hypot(data[i] - k.rgb[0], data[i + 1] - k.rgb[1], data[i + 2] - k.rgb[2])
        if (d < k.tol) {
          data[i + 3] = 0
          break
        }
        // borde suave: desvanece la franja de transición
        const soft = k.feather ?? 1.6
        if (soft > 1 && d < k.tol * soft) {
          const f = (d - k.tol) / (k.tol * (soft - 1))
          data[i + 3] = Math.min(data[i + 3], Math.round(255 * f))
          break
        }
      }
    }
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
}

;(async () => {
  fs.mkdirSync(OUT, { recursive: true })
  for (const file of files) {
    const keyed = await keyOut(file)
    const trimmed = await keyed.png().trim({ threshold: 6 }).toBuffer()
    const meta = await sharp(trimmed).metadata()
    const aspect = meta.width / meta.height

    // Peso óptico: los isologos cuadrados se ven más grandes a igual altura.
    const k = aspect >= 2.4 ? 1 : aspect >= 1.3 ? 0.88 : 0.74
    let w = Math.round(BOX_W * k)
    let h = Math.round(BOX_H * k)
    if (aspect > w / h) h = Math.round(w / aspect)
    else w = Math.round(h * aspect)

    const art = await sharp(trimmed).resize(w, h, { fit: "fill" }).toBuffer()
    await sharp({
      create: {
        width: BOX_W,
        height: BOX_H,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([{ input: art, gravity: "centre" }])
      .webp({ quality: 92, alphaQuality: 100 })
      .toFile(path.join(OUT, file.toLowerCase()))

    console.log(file, "->", `clean/${file.toLowerCase()}`, `${w}x${h}`)
  }
})()
