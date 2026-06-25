import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { pageAPI } from '../services/api'

export default function CmsPage() {
  const { slug } = useParams()
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError('')

    pageAPI.getPublishedPage(slug)
      .then((result) => {
        if (!mounted) return
        setPage(result)
        document.title = result.seoTitle || result.title
        const description = result.seoDescription || result.excerpt
        if (description) {
          let meta = document.querySelector('meta[name="description"]')
          if (!meta) {
            meta = document.createElement('meta')
            meta.name = 'description'
            document.head.appendChild(meta)
          }
          meta.content = description
        }
      })
      .catch((loadError) => {
        if (mounted) setError(loadError.message || 'Page not found')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [slug])

  if (loading) {
    return <div className="min-h-[70vh] grid place-items-center bg-[#fcfaf8] text-[#1a1410]">Loading page...</div>
  }

  if (error || !page) {
    return (
      <div className="min-h-[70vh] grid place-items-center bg-[#fcfaf8] px-5 text-center">
        <div>
          <p className="font-cormorant text-5xl text-[#1a1410]">Page not found</p>
          <Link to="/" className="inline-block mt-6 text-[10px] tracking-[.2em] uppercase text-[#a58248] border-b border-[#a58248]">Return home</Link>
        </div>
      </div>
    )
  }

  return (
    <article className="bg-[#fcfaf8] text-[#1a1410]">
      <header className="relative min-h-[56vh] overflow-hidden grid place-items-end">
        {page.featuredImage && <img src={page.featuredImage} alt="" className="absolute inset-0 h-full w-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
        <div className="relative z-10 w-full max-w-5xl mx-auto px-5 md:px-8 pb-14 text-white">
          <p className="font-montserrat text-[9px] tracking-[.34em] uppercase text-[#e4c77d]">Third Eye Scent Journal</p>
          <h1 className="font-cormorant text-5xl md:text-7xl leading-none mt-3">{page.title}</h1>
          {page.excerpt && <p className="max-w-2xl mt-5 text-sm leading-7 text-white/75">{page.excerpt}</p>}
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-5 md:px-8 py-16 md:py-24">
        <div
          className="font-montserrat text-sm leading-8 text-[#3f3933] [&_h2]:font-cormorant [&_h2]:text-4xl [&_h2]:text-[#1a1410] [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:font-cormorant [&_h3]:text-3xl [&_p]:mb-6 [&_a]:text-[#9c793f] [&_a]:underline"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>
    </article>
  )
}
