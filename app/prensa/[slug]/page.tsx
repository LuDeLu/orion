import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PrensaArticle } from "@/components/prensa-article"
import { PrensaStructuredData } from "@/components/prensa-structured-data"
import { getNota, notasSlugs } from "@/lib/prensa"

const BASE = "https://orionmkt.com.ar"

export function generateStaticParams() {
  return notasSlugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const nota = getNota(slug)
  if (!nota) return {}

  const url = `${BASE}/prensa/${nota.slug}`
  const imageUrl = `${BASE}${nota.hero.src}`

  return {
    title: nota.metaTitle,
    description: nota.metaDescription,
    keywords: nota.keywords,
    authors: [{ name: "Elbio Stoler" }],
    alternates: { canonical: url },
    openGraph: {
      title: nota.metaTitle,
      description: nota.metaDescription,
      url,
      siteName: "Orion Marketing",
      locale: "es_AR",
      type: "article",
      publishedTime: nota.datePublished,
      modifiedTime: nota.dateModified,
      authors: ["Elbio Stoler"],
      tags: nota.tags,
      images: [{ url: imageUrl, width: nota.hero.width, height: nota.hero.height, alt: nota.hero.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: nota.metaTitle,
      description: nota.metaDescription,
      images: [imageUrl],
    },
  }
}

export default async function NotaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const nota = getNota(slug)
  if (!nota) notFound()

  return (
    <>
      <PrensaStructuredData nota={nota} />
      <PrensaArticle nota={nota} />
    </>
  )
}
