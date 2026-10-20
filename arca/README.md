# Certificados de ARCA (.crt + .key)

Poné acá el par de cada entorno, con estos nombres exactos:

| Archivo                | Qué es                                         |
| ---------------------- | ---------------------------------------------- |
| `homologacion.crt`     | Certificado de prueba (WSASS)                  |
| `homologacion.key`     | Su clave privada, sin contraseña               |
| `produccion.crt`       | Certificado real (Administración de Certificados Digitales) |
| `produccion.key`       | Su clave privada, sin contraseña               |

El sistema los toma solos y tienen prioridad sobre lo cargado en el panel
(solo las variables `ARCA_CERT` / `ARCA_KEY` les ganan).

**Esta carpeta está en `.gitignore` y no se sube a GitHub** (el repo es público:
quien tenga la `.key` puede facturar a tu nombre). Por eso en Vercel no existe:
allá cargá el mismo par desde **Facturación → Configuración → Subir .crt y .key**,
que lo guarda cifrado.
