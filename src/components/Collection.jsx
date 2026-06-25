import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from './ProductCard'
import { productAPI } from '../services/api'

export default function Collection() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    productAPI.getProducts({ limit: 100 })
      .then((apiProducts) => {
        if (!isMounted) return
        setProducts(Array.isArray(apiProducts) ? apiProducts : [])
      })
      .catch((loadError) => {
        if (!isMounted) return
        setProducts([])
        setError(loadError.message || 'Unable to load the collection.')
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section id="collection" className="py-[72px] pb-[80px] bg-white">
      <div className="px-0">
        <div className="text-center mb-[44px]">
          <p className="font-montserrat text-[10px] tracking-[.40em] uppercase mb-2 collection-label-color">Signature Range</p>
          <h2 className="font-cormorant font-light tracking-[.06em] text-[#1a1410] mb-2 collection-title">The Collection</h2>
          <p className="font-montserrat text-[10px] tracking-[.14em] collection-sub-color">Pre-Fall 2026 &nbsp;·&nbsp; {products.length} Signatures</p>
        </div>

        {loading && <p className="py-16 text-center font-montserrat text-[10px] uppercase tracking-[.2em] text-[#1a1410]/45">Loading collection...</p>}
        {!loading && error && <p className="py-16 text-center font-montserrat text-[10px] uppercase tracking-[.2em] text-[#1a1410]/45">{error}</p>}
        {!loading && !error && products.length === 0 && <p className="py-16 text-center font-montserrat text-[10px] uppercase tracking-[.2em] text-[#1a1410]/45">No fragrances are available yet.</p>}
        {products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
            {products.map((p, idx) => (
              <ProductCard key={p.id} product={p} className={idx === 4 ? 'hidden lg:flex' : ''} />
            ))}
          </div>
        )}

        <div className="text-center mt-[44px]">
          <Link
            to="/shop"
            className="font-montserrat text-[10px] tracking-[.28em] uppercase text-[#1a1410] no-underline pb-[3px] transition-all hover:opacity-50 view-all-border"
          >
            View Full Collection
          </Link>
        </div>
      </div>
    </section>
  )
}
