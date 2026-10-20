/**
 * PDF de comprobantes y presupuestos con la identidad de Orion.
 * Cumple el diseño de RG 1415 / RG 4291: letra y código en recuadro central,
 * datos del emisor y receptor, CAE con vencimiento y el QR de ARCA (RG 4892).
 */
import path from "node:path"
import { readFileSync } from "node:fs"
import QRCode from "qrcode"
import { Document, Image, Page, StyleSheet, Text, View, renderToBuffer } from "@react-pdf/renderer"
import type { ConfigFacturacion } from "./config"
import { importeLinea, subtotalItem } from "./calculo"
import {
  alicuota,
  condicionIva,
  CONCEPTOS,
  dinero,
  fechaAr,
  formatoCuit,
  MONEDAS,
  nombreDocumento,
  numeroCbte,
  tipoCbte,
  tipoDoc,
  type Documento,
} from "./modelo"

const C = {
  tinta: "#1b1029",
  naranja: "#ee7023",
  dorado: "#dbac34",
  gris: "#6b6577",
  linea: "#e7e3ec",
  fondo: "#f7f5fa",
}

const s = StyleSheet.create({
  pagina: { paddingTop: 0, paddingBottom: 70, paddingHorizontal: 0, fontFamily: "Helvetica", fontSize: 9, color: C.tinta },
  franja: { height: 6, backgroundColor: C.naranja },
  cuerpo: { paddingHorizontal: 34 },
  cabecera: { flexDirection: "row", justifyContent: "space-between", alignItems: "stretch", marginTop: 20 },
  colEmisor: { width: "44%" },
  colLetra: { width: "12%", alignItems: "center" },
  colDatos: { width: "44%", alignItems: "flex-end" },
  logo: { width: 150, height: 57, objectFit: "contain", marginBottom: 8 },
  letraCaja: { width: 46, height: 46, borderWidth: 1.5, borderColor: C.tinta, borderRadius: 6, alignItems: "center", justifyContent: "center" },
  letra: { fontSize: 26, fontFamily: "Helvetica-Bold" },
  codigo: { fontSize: 6.5, marginTop: 3, color: C.gris },
  lineaVertical: { width: 1, flexGrow: 1, backgroundColor: C.linea, marginTop: 4 },
  titulo: { fontSize: 15, fontFamily: "Helvetica-Bold", textAlign: "right", color: C.tinta },
  copia: { fontSize: 7, color: C.naranja, fontFamily: "Helvetica-Bold", letterSpacing: 1.5, marginBottom: 4 },
  numero: { fontSize: 11, fontFamily: "Helvetica-Bold", marginTop: 3 },
  dato: { fontSize: 8, color: C.gris, marginTop: 1.5 },
  datoFuerte: { fontFamily: "Helvetica-Bold", color: C.tinta },
  bloque: { marginTop: 14, borderRadius: 6, backgroundColor: C.fondo, padding: 10, flexDirection: "row", flexWrap: "wrap" },
  campo: { width: "50%", marginBottom: 4, paddingRight: 8 },
  etiqueta: { fontSize: 6.5, color: C.gris, textTransform: "uppercase", letterSpacing: 0.8 },
  valor: { fontSize: 9, marginTop: 1.5 },
  tabla: { marginTop: 14 },
  filaCab: { flexDirection: "row", backgroundColor: C.tinta, color: "#ffffff", borderRadius: 4, paddingVertical: 6, paddingHorizontal: 6 },
  fila: { flexDirection: "row", paddingVertical: 6, paddingHorizontal: 6, borderBottomWidth: 0.6, borderBottomColor: C.linea },
  th: { fontSize: 7, fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 0.6 },
  totales: { marginTop: 12, flexDirection: "row", justifyContent: "space-between" },
  totalesCaja: { width: "46%" },
  totalFila: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 2.5 },
  totalFinal: { flexDirection: "row", justifyContent: "space-between", marginTop: 5, paddingVertical: 8, paddingHorizontal: 10, backgroundColor: C.naranja, borderRadius: 5, color: "#ffffff" },
  notas: { width: "50%", fontSize: 8, color: C.gris },
  transparencia: { marginTop: 10, padding: 8, borderWidth: 0.8, borderColor: C.linea, borderRadius: 5 },
  pie: { position: "absolute", bottom: 0, left: 0, right: 0 },
  pieContenido: { paddingHorizontal: 34, paddingVertical: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: C.tinta, color: "#ffffff" },
  qr: { width: 62, height: 62, backgroundColor: "#ffffff", padding: 3, borderRadius: 3 },
  homo: { position: "absolute", top: 330, left: 60, fontSize: 52, color: "#ee702322", transform: "rotate(-30deg)", fontFamily: "Helvetica-Bold" },
})

let logoCache: Buffer | null = null
function logo() {
  if (!logoCache) logoCache = readFileSync(path.join(process.cwd(), "public", "logohorizontal.png"))
  return logoCache
}

/** URL del QR de ARCA (especificación v1 de RG 4892). */
function urlQr(doc: Documento, cfg: ConfigFacturacion) {
  const datos = {
    ver: 1,
    fecha: doc.fecha,
    cuit: Number(cfg.cuit),
    ptoVta: doc.puntoVenta,
    tipoCmp: doc.tipo,
    nroCmp: doc.numero,
    importe: doc.totales.total,
    moneda: doc.moneda,
    ctz: doc.cotizacion || 1,
    tipoDocRec: doc.receptor.docTipo,
    nroDocRec: Number(doc.receptor.docNro) || 0,
    tipoCodAut: "E",
    codAut: Number(doc.cae),
  }
  return `https://www.afip.gob.ar/fe/qr/?p=${Buffer.from(JSON.stringify(datos)).toString("base64")}`
}

const condicionEmisor = (cfg: ConfigFacturacion) =>
  cfg.condicionIva === "responsable_inscripto"
    ? "IVA Responsable Inscripto"
    : cfg.condicionIva === "exento"
      ? "IVA Sujeto Exento"
      : `Responsable Monotributo${cfg.categoriaMonotributo ? ` (cat. ${cfg.categoriaMonotributo})` : ""}`

function Campo({ etiqueta, valor, ancho }: { etiqueta: string; valor?: string; ancho?: string }) {
  if (!valor) return null
  return (
    <View style={[s.campo, ancho ? { width: ancho } : {}]}>
      <Text style={s.etiqueta}>{etiqueta}</Text>
      <Text style={s.valor}>{valor}</Text>
    </View>
  )
}

function Comprobante({ doc, cfg, copia, qr }: { doc: Documento; cfg: ConfigFacturacion; copia: string; qr: string | null }) {
  const esPresupuesto = doc.clase === "presupuesto"
  const t = tipoCbte(doc.tipo)
  const letra = esPresupuesto ? "X" : (t?.letra ?? "")
  const netoEnLineas = letra === "A" || letra === "M"
  const discrimina = netoEnLineas || letra === "B" || (esPresupuesto && cfg.condicionIva === "responsable_inscripto")
  const mostrarIvaCol = netoEnLineas
  const m = doc.moneda
  const venceValidez = doc.validezDias
    ? new Date(new Date(doc.fecha).getTime() + doc.validezDias * 864e5).toISOString().slice(0, 10)
    : ""

  return (
    <Page size="A4" style={s.pagina}>
      <View style={s.franja} fixed />
      {doc.entorno === "homologacion" && !esPresupuesto && <Text style={s.homo}>SIN VALIDEZ FISCAL</Text>}

      <View style={s.cuerpo}>
        {/* Cabecera */}
        <View style={s.cabecera}>
          <View style={s.colEmisor}>
            <Image src={logo()} style={s.logo} />
            <Text style={[s.dato, s.datoFuerte, { fontSize: 9 }]}>{cfg.razonSocial || cfg.nombreFantasia}</Text>
            {cfg.domicilio ? <Text style={s.dato}>{cfg.domicilio}</Text> : null}
            <Text style={s.dato}>{condicionEmisor(cfg)}</Text>
            {[cfg.email, cfg.telefono, cfg.web].filter(Boolean).length ? (
              <Text style={s.dato}>{[cfg.email, cfg.telefono, cfg.web].filter(Boolean).join("  ·  ")}</Text>
            ) : null}
          </View>

          <View style={s.colLetra}>
            <View style={s.letraCaja}>
              <Text style={s.letra}>{letra}</Text>
            </View>
            <Text style={s.codigo}>{esPresupuesto ? "NO VÁLIDO COMO FACTURA" : `COD. ${String(doc.tipo).padStart(3, "0")}`}</Text>
            <View style={s.lineaVertical} />
          </View>

          <View style={s.colDatos}>
            {esPresupuesto ? null : <Text style={s.copia}>{copia}</Text>}
            <Text style={s.titulo}>{nombreDocumento(doc).toUpperCase()}</Text>
            <Text style={s.numero}>
              N° {esPresupuesto ? `P-${String(doc.numero).padStart(6, "0")}` : numeroCbte(doc.puntoVenta, doc.numero)}
            </Text>
            <Text style={s.dato}>
              Fecha de emisión: <Text style={s.datoFuerte}>{fechaAr(doc.fecha)}</Text>
            </Text>
            <Text style={s.dato}>CUIT: {formatoCuit(cfg.cuit)}</Text>
            {cfg.iibb ? <Text style={s.dato}>Ingresos Brutos: {cfg.iibb}</Text> : null}
            {cfg.inicioActividades ? <Text style={s.dato}>Inicio de actividades: {fechaAr(cfg.inicioActividades)}</Text> : null}
            {esPresupuesto && venceValidez ? (
              <Text style={s.dato}>
                Válido hasta: <Text style={s.datoFuerte}>{fechaAr(venceValidez)}</Text>
              </Text>
            ) : null}
          </View>
        </View>

        {/* Receptor */}
        <View style={s.bloque}>
          <Campo etiqueta={esPresupuesto ? "Para" : "Cliente"} valor={doc.receptor.nombre} />
          <Campo
            etiqueta={tipoDoc(doc.receptor.docTipo)}
            valor={doc.receptor.docTipo === 99 ? "—" : doc.receptor.docTipo === 80 || doc.receptor.docTipo === 86 ? formatoCuit(doc.receptor.docNro) : doc.receptor.docNro}
          />
          <Campo etiqueta="Condición frente al IVA" valor={condicionIva(doc.receptor.condicionIva)?.nombre} />
          <Campo etiqueta="Condición de venta" valor={doc.condicionVenta} />
          <Campo etiqueta="Domicilio" valor={doc.receptor.domicilio} />
          <Campo etiqueta="Email" valor={doc.receptor.email} />
          {!esPresupuesto && (
            <Campo etiqueta="Concepto" valor={CONCEPTOS.find((c) => c.id === doc.concepto)?.nombre} />
          )}
          {doc.concepto !== 1 && doc.servicioDesde ? (
            <Campo etiqueta={esPresupuesto ? "Período del servicio" : "Período facturado"} valor={`${fechaAr(doc.servicioDesde)} al ${fechaAr(doc.servicioHasta)}`} />
          ) : null}
          {doc.vencimientoPago && !esPresupuesto ? <Campo etiqueta="Vencimiento del pago" valor={fechaAr(doc.vencimientoPago)} /> : null}
          {doc.asociado ? (
            <Campo
              etiqueta="Comprobante asociado"
              valor={`${tipoCbte(doc.asociado.tipo)?.nombre ?? ""} ${numeroCbte(doc.asociado.puntoVenta, doc.asociado.numero)} del ${fechaAr(doc.asociado.fecha)}`}
            />
          ) : null}
          {m !== "PES" ? (
            <Campo etiqueta="Moneda" valor={`${MONEDAS.find((x) => x.id === m)?.nombre} · cotización ${doc.cotizacion.toLocaleString("es-AR")}`} />
          ) : null}
        </View>

        {/* Ítems */}
        <View style={s.tabla}>
          <View style={s.filaCab} fixed>
            <Text style={[s.th, { flex: 1 }]}>Descripción</Text>
            <Text style={[s.th, { width: 44, textAlign: "right" }]}>Cant.</Text>
            <Text style={[s.th, { width: 72, textAlign: "right" }]}>P. unitario</Text>
            <Text style={[s.th, { width: 40, textAlign: "right" }]}>Bonif.</Text>
            {mostrarIvaCol && <Text style={[s.th, { width: 40, textAlign: "right" }]}>IVA</Text>}
            <Text style={[s.th, { width: 80, textAlign: "right" }]}>Subtotal</Text>
          </View>
          {doc.items.map((it, i) => {
            const linea = discrimina ? importeLinea(it, netoEnLineas, doc.preciosConIva) : subtotalItem(it) / 100
            const unit = it.cantidad ? linea / it.cantidad / (1 - it.bonificacion / 100 || 1) : 0
            return (
              <View key={i} style={s.fila} wrap={false}>
                <Text style={{ flex: 1, paddingRight: 8 }}>{it.descripcion}</Text>
                <Text style={{ width: 44, textAlign: "right" }}>
                  {it.cantidad.toLocaleString("es-AR")} {it.unidad !== "u." ? it.unidad : ""}
                </Text>
                <Text style={{ width: 72, textAlign: "right" }}>{dinero(unit, m)}</Text>
                <Text style={{ width: 40, textAlign: "right" }}>{it.bonificacion ? `${it.bonificacion}%` : "—"}</Text>
                {mostrarIvaCol && <Text style={{ width: 40, textAlign: "right" }}>{alicuota(it.iva)?.nombre}</Text>}
                <Text style={{ width: 80, textAlign: "right", fontFamily: "Helvetica-Bold" }}>{dinero(linea, m)}</Text>
              </View>
            )
          })}
        </View>

        {/* Totales y notas */}
        <View style={s.totales} wrap={false}>
          <View style={s.notas}>
            {doc.observaciones ? (
              <>
                <Text style={[s.etiqueta, { marginBottom: 3 }]}>Observaciones</Text>
                <Text>{doc.observaciones}</Text>
              </>
            ) : null}
            {cfg.datosPago ? (
              <>
                <Text style={[s.etiqueta, { marginBottom: 3, marginTop: 8 }]}>Datos para el pago</Text>
                <Text>{cfg.datosPago}</Text>
              </>
            ) : null}
          </View>
          <View style={s.totalesCaja}>
            {netoEnLineas ? (
              <>
                <View style={s.totalFila}>
                  <Text>Importe neto gravado</Text>
                  <Text>{dinero(doc.totales.neto, m)}</Text>
                </View>
                {doc.totales.ivas.map((a) => (
                  <View key={a.id} style={s.totalFila}>
                    <Text>IVA {alicuota(a.id)?.nombre}</Text>
                    <Text>{dinero(a.importe, m)}</Text>
                  </View>
                ))}
                {doc.totales.exento ? (
                  <View style={s.totalFila}>
                    <Text>Importe exento</Text>
                    <Text>{dinero(doc.totales.exento, m)}</Text>
                  </View>
                ) : null}
                {doc.totales.noGravado ? (
                  <View style={s.totalFila}>
                    <Text>Importe no gravado</Text>
                    <Text>{dinero(doc.totales.noGravado, m)}</Text>
                  </View>
                ) : null}
              </>
            ) : (
              <View style={s.totalFila}>
                <Text>Subtotal</Text>
                <Text>{dinero(doc.totales.total, m)}</Text>
              </View>
            )}
            <View style={s.totalFinal}>
              <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 11 }}>TOTAL</Text>
              <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 11 }}>{dinero(doc.totales.total, m)}</Text>
            </View>
          </View>
        </View>

        {/* Ley 27.743: Régimen de Transparencia Fiscal al Consumidor (Factura B) */}
        {letra === "B" && !esPresupuesto ? (
          <View style={s.transparencia} wrap={false}>
            <Text style={[s.etiqueta, { marginBottom: 2 }]}>Régimen de Transparencia Fiscal al Consumidor (Ley 27.743)</Text>
            <Text>IVA contenido: {dinero(doc.totales.iva, m)}   ·   Otros impuestos nacionales indirectos: {dinero(0, m)}</Text>
          </View>
        ) : null}

        {esPresupuesto ? (
          <Text style={[s.dato, { marginTop: 14 }]}>
            Documento no válido como factura. Los precios{cfg.condicionIva === "responsable_inscripto" ? (doc.preciosConIva ? " incluyen IVA" : " no incluyen IVA") : ""} se mantienen
            {doc.validezDias ? ` durante ${doc.validezDias} días` : ""} desde la fecha de emisión.
          </Text>
        ) : null}
      </View>

      {/* Pie con CAE y QR */}
      <View style={s.pie} fixed>
        <View style={s.pieContenido}>
          {qr ? <Image src={qr} style={s.qr} /> : null}
          <View style={{ flex: 1, paddingHorizontal: 12 }}>
            {!esPresupuesto && doc.cae ? (
              <>
                <Text style={{ fontSize: 7, color: C.dorado, letterSpacing: 1 }}>COMPROBANTE AUTORIZADO POR ARCA</Text>
                <Text style={{ fontSize: 9, marginTop: 2, fontFamily: "Helvetica-Bold" }}>CAE N° {doc.cae}</Text>
                <Text style={{ fontSize: 8, marginTop: 1 }}>Vencimiento del CAE: {fechaAr(doc.caeVencimiento)}</Text>
              </>
            ) : (
              <Text style={{ fontSize: 8 }}>{cfg.leyendaPie}</Text>
            )}
            {!esPresupuesto && cfg.leyendaPie ? <Text style={{ fontSize: 7, marginTop: 3, color: "#ffffffaa" }}>{cfg.leyendaPie}</Text> : null}
          </View>
          <Text style={{ fontSize: 7, color: "#ffffff99" }} render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
        </View>
      </View>
    </Page>
  )
}

export async function generarPdf(doc: Documento, cfg: ConfigFacturacion, copias: string[] = ["ORIGINAL"]) {
  const qr =
    doc.clase === "factura" && doc.cae
      ? await QRCode.toDataURL(urlQr(doc, cfg), { margin: 0, width: 240, errorCorrectionLevel: "M" })
      : null
  const etiquetas = doc.clase === "presupuesto" ? ["PRESUPUESTO"] : copias
  return renderToBuffer(
    <Document title={`${nombreDocumento(doc)} ${numeroCbte(doc.puntoVenta, doc.numero)}`} author={cfg.razonSocial || "Orion"} creator="Orion · Facturación">
      {etiquetas.map((c) => (
        <Comprobante key={c} doc={doc} cfg={cfg} copia={c} qr={qr} />
      ))}
    </Document>,
  )
}

export function nombreArchivo(doc: Documento) {
  const base = doc.clase === "presupuesto" ? `Presupuesto-P${String(doc.numero).padStart(6, "0")}` : `${(tipoCbte(doc.tipo)?.nombre ?? "Comprobante").replace(/\s+/g, "-")}-${numeroCbte(doc.puntoVenta, doc.numero)}`
  const cliente = doc.receptor.nombre.replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "").slice(0, 40)
  return `${base}${cliente ? `-${cliente}` : ""}.pdf`
}
