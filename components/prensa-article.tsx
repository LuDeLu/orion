import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ArrowRight, CalendarDays, Clock, ExternalLink, Quote } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getNota, type Nota } from "@/lib/prensa"

function formatFecha(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

/**
 * Página de nota de prensa. Server component: todo el texto viaja en el HTML
 * inicial, que es lo que indexa Google. Header y Footer son client components
 * y se montan igual sin romper el renderizado del artículo.
 */
export function PrensaArticle({ nota }: { nota: Nota }) {
  const related = getNota(nota.relatedSlug)

  return (
    <main className="relative min-h-screen flex flex-col bg-background">
      <Header />

      <article className="flex-1 px-4 pt-32 pb-20">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Migas de pan" className="mb-6 text-xs font-medium text-foreground/50">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Inicio
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/prensa" className="hover:text-primary transition-colors">
                  Prensa
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-foreground/70">{nota.eyebrow}</li>
            </ol>
          </nav>

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {nota.eyebrow}
          </p>

          <h1 className="mt-3 text-3xl md:text-[2.6rem] font-display font-extrabold text-foreground tracking-tight leading-[1.08]">
            {nota.title}
          </h1>

          <p className="mt-5 text-lg text-foreground/75 leading-relaxed">{nota.excerpt}</p>

          {/* Meta */}
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-foreground/55">
            <span className="font-semibold text-foreground/80">{nota.author}</span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4" />
              {formatFecha(nota.datePublished)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {nota.readingMinutes} min de lectura
            </span>
          </div>
        </div>

        {/* Hero image */}
        <figure className="max-w-4xl mx-auto mt-10">
          <div className="relative aspect-[698/364] w-full overflow-hidden rounded-2xl border border-border bg-card">
            <Image
              src={nota.hero.src}
              alt={nota.hero.alt}
              fill
              priority
              sizes="(max-width: 896px) 100vw, 896px"
              className="object-cover"
            />
          </div>
          {nota.hero.caption && (
            <figcaption className="mt-3 text-center text-xs text-foreground/45">
              {nota.hero.caption}
            </figcaption>
          )}
        </figure>

        {/* Body */}
        <div className="max-w-3xl mx-auto mt-12 space-y-10">
          {nota.blocks.map((block, i) => (
            <section key={i}>
              {block.heading && (
                <h2 className="text-xl md:text-2xl font-display font-bold text-foreground mb-3 leading-tight">
                  {block.heading}
                </h2>
              )}
              <div className="space-y-4">
                {block.paragraphs.map((p, j) => (
                  <p key={j} className="text-[1.0625rem] text-foreground/80 leading-[1.75]">
                    {p}
                  </p>
                ))}
              </div>

              {/* Cita destacada tras el primer bloque */}
              {i === 0 && nota.quote && (
                <blockquote className="mt-8 rounded-2xl border border-primary/25 bg-primary/[0.06] p-6 md:p-7">
                  <Quote className="w-6 h-6 text-primary/70" aria-hidden />
                  <p className="mt-3 text-lg md:text-xl font-display font-medium text-foreground leading-snug">
                    {nota.quote.text}
                  </p>
                  <footer className="mt-4 text-sm text-foreground/60">
                    <span className="font-semibold text-foreground/85">{nota.quote.author}</span>
                    {" — "}
                    {nota.quote.role}
                  </footer>
                </blockquote>
              )}
            </section>
          ))}
        </div>

        {/* Ficha técnica */}
        {nota.ficha && (
          <div className="max-w-3xl mx-auto mt-12">
            <h2 className="text-xl md:text-2xl font-display font-bold text-foreground mb-5">
              Ficha del proyecto
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border">
              {nota.ficha.map((row) => (
                <div key={row.label} className="bg-card p-4">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-foreground/45">
                    {row.label}
                  </dt>
                  <dd className="mt-1 text-[0.95rem] font-medium text-foreground/90">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {/* Galería */}
        {nota.gallery.length > 0 && (
          <div className="max-w-4xl mx-auto mt-14">
            <h2 className="text-xl md:text-2xl font-display font-bold text-foreground mb-5">
              Galería
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {nota.gallery.map((img) => (
                <figure key={img.src} className="group">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-card">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, 440px"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  {img.caption && (
                    <figcaption className="mt-2 text-xs text-foreground/45">{img.caption}</figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        )}

        {/* Fuente + tags */}
        <div className="max-w-3xl mx-auto mt-14 border-t border-border pt-6">
          <p className="text-sm text-foreground/55">
            Nota basada en la publicación original de{" "}
            <a
              href={nota.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
            >
              {nota.source.name}
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            .
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {nota.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground/65"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Nota relacionada */}
        {related && (
          <div className="max-w-3xl mx-auto mt-10">
            <Link
              href={`/prensa/${related.slug}`}
              className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground/45">
                  Seguí leyendo
                </p>
                <p className="mt-1 font-display font-bold text-foreground leading-snug">
                  {related.title}
                </p>
              </div>
              <ArrowRight className="w-5 h-5 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        )}

        {/* Volver */}
        <div className="max-w-3xl mx-auto mt-10">
          <Link
            href="/prensa"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-[gap]"
          >
            <ArrowLeft className="w-4 h-4" />
            Ver todas las notas
          </Link>
        </div>
      </article>

      <Footer />
    </main>
  )
}
