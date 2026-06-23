import React, { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import SocialMarquee from '../components/SocialMarquee'
import { products as fallbackProducts } from '../data/products'
import { categoryAPI, productAPI } from '../services/api'

// Clean hero section
export default function Shop() {
  const [searchParams] = useSearchParams()
  const categoryParam = searchParams.get('category') || 'All'

  const [heroVisible, setHeroVisible] = useState(false)
  const [filterActive, setFilterActive] = useState(categoryParam)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState('default')
  const [sortOpen, setSortOpen] = useState(false)
  const [products, setProducts] = useState(fallbackProducts)
  const [categories, setCategories] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const heroRef = useRef(null)

  const filters = ['All', ...(categories.length ? categories.map((category) => category.name) : ['Oud', 'Rose', 'Musk'])]

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    let isMounted = true

    Promise.all([
      productAPI.getProducts({ limit: 100 }),
      categoryAPI.getCategories(),
    ])
      .then(([apiProducts, apiCategories]) => {
        if (!isMounted) return
        if (Array.isArray(apiProducts) && apiProducts.length) {
          setProducts(apiProducts)
        }
        if (Array.isArray(apiCategories)) {
          setCategories(apiCategories)
        }
      })
      .catch(() => {
        if (isMounted) setProducts(fallbackProducts)
      })
      .finally(() => {
        if (isMounted) setLoadingProducts(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    setFilterActive(categoryParam)
  }, [categoryParam])

  let filteredProducts = products.filter(p => {
    const productCategory = typeof p.category === 'object' ? p.category?.name : p.category
    const matchesCategory = filterActive === 'All' || productCategory?.toLowerCase() === filterActive.toLowerCase() || p.name.toLowerCase().includes(filterActive.toLowerCase())
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.desc.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  if (sortOrder === 'price-asc') {
    filteredProducts.sort((a, b) => parseInt(a.price.replace(/\D/g, '')) - parseInt(b.price.replace(/\D/g, '')))
  } else if (sortOrder === 'price-desc') {
    filteredProducts.sort((a, b) => parseInt(b.price.replace(/\D/g, '')) - parseInt(a.price.replace(/\D/g, '')))
  }

  return (
    <>
      {/* ══ SHOP HERO ══ */}
      <section
        ref={heroRef}
        className="relative w-full overflow-hidden shop-hero-section"

      >
        {/* Background image with parallax feel */}
        <div className="absolute inset-0 z-0">
          <img
            src="/img/hero/shopbnr2.png"
            alt="Shop Background"
            className="w-full h-full object-cover object-[center_35%]"
            style={{ transition: 'transform 12s ease-out', transformOrigin: 'center 35%' }}
          />
          {/* Dark luxury overlay with reduced opacity */}
          <div className="absolute inset-0 shop-hero-overlay opacity-50" />
        </div>

        {/* Hero Content (Positioned at bottom center) */}
        <div className="relative z-10 w-full flex flex-col items-center justify-end px-4 pb-12" style={{ minHeight: '60vh' }}>

          {/* Breadcrumb with Glass Gold Effect */}
          <div
            className="footer-gold-band backdrop-blur-xl border border-[#c9a96e]/40 shadow-2xl px-6 py-3 rounded-sm flex items-center gap-3"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateX(0)' : 'translateX(-28px)',
              transition: 'opacity 0.6s ease, transform 0.6s ease',
              transitionDelay: '0.2s'
            }}
          >
            <nav className="flex items-center gap-3 font-montserrat text-[10px] tracking-[.25em] uppercase text-white/80">
              <Link to="/" className="hover:text-[#c9a96e] transition-colors">
                Home
              </Link>
              <span className="text-white/40">/</span>
              <h1 className="text-[#c9a96e] m-0 font-normal inline-block">
                The Shop
              </h1>
            </nav>
          </div>
        </div>

      </section>

      {/* ══ PRODUCT GRID SECTION ══ */}
      <section id="shop-grid" className="bg-white py-[72px] w-full">
        <div className="w-full max-w-[1320px] mx-auto">

          {/* Section Header */}
          <div className="text-center mb-[48px]">
            <p className="font-montserrat text-[10px] tracking-[.40em] uppercase mb-2 collection-label-color">
              All Creations
            </p>
            <h2 className="font-cormorant font-light tracking-[.06em] text-[#1a1410] collection-title mb-2">
              Full Collection
            </h2>
            <p className="font-montserrat text-[10px] tracking-[.14em] collection-sub-color">
              {products.length} Signatures &nbsp;·&nbsp; Pre-Fall 2026
            </p>
          </div>

          {/* Simple Classic Toolbar */}
          <div className="w-full mb-[56px] border-y border-[#1a1410]/10 py-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">

              {/* Left Side: Categories */}
              <div className="flex items-center gap-6 flex-wrap justify-center">
                {filters.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilterActive(f)}
                    className={`font-montserrat text-[10px] tracking-[.25em] uppercase pb-1 border-b transition-all duration-300 cursor-pointer ${filterActive === f
                      ? 'text-[#1a1410] border-[#1a1410]'
                      : 'text-[#1a1410]/50 border-transparent hover:text-[#1a1410] hover:border-[#1a1410]/30'
                      }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Right Side: Search and Sort */}
              <div className="flex items-center gap-6 w-full md:w-auto">
                {/* Search */}
                <div className="relative flex-1 md:w-[200px]">
                  <i className="fa-solid fa-search absolute left-0 top-1/2 -translate-y-1/2 text-[10px] text-[#1a1410]/40" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border-b border-[#1a1410]/10 pl-6 pr-0 py-2 font-montserrat text-[10px] tracking-[.15em] text-[#1a1410] placeholder-[#1a1410]/40 focus:outline-none focus:border-[#1a1410]/60 transition-all"
                  />
                </div>

                {/* Sort Dropdown Custom */}
                <div className="relative flex-shrink-0" onMouseLeave={() => setSortOpen(false)}>
                  <button 
                    onClick={() => setSortOpen(!sortOpen)}
                    className={`flex items-center gap-2 bg-transparent border-b pl-2 pr-6 py-2 font-montserrat text-[10px] tracking-[.15em] uppercase transition-all cursor-pointer relative ${sortOpen ? 'border-[#1a1410] text-[#1a1410]' : 'border-[#1a1410]/10 text-[#1a1410]/70 hover:border-[#1a1410]/40'}`}
                  >
                    {sortOrder === 'default' ? 'Sort: Featured' : sortOrder === 'price-asc' ? 'Price: Low to High' : 'Price: High to Low'}
                    <i className={`fa-solid fa-chevron-down absolute right-0 top-1/2 -translate-y-1/2 text-[9px] text-[#1a1410]/70 transition-transform duration-300 ${sortOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {sortOpen && (
                    <div className="absolute top-full right-0 mt-[1px] w-[200px] bg-white border border-[#1a1410]/10 shadow-lg z-50 py-2">
                      <div 
                        className={`px-5 py-3 font-montserrat text-[10px] tracking-[.15em] uppercase cursor-pointer transition-colors ${sortOrder === 'default' ? 'text-[#1a1410] bg-[#1a1410]/5' : 'text-[#1a1410]/60 hover:text-[#1a1410] hover:bg-[#1a1410]/5'}`}
                        onClick={() => { setSortOrder('default'); setSortOpen(false) }}
                      >
                        Sort: Featured
                      </div>
                      <div 
                        className={`px-5 py-3 font-montserrat text-[10px] tracking-[.15em] uppercase cursor-pointer transition-colors ${sortOrder === 'price-asc' ? 'text-[#1a1410] bg-[#1a1410]/5' : 'text-[#1a1410]/60 hover:text-[#1a1410] hover:bg-[#1a1410]/5'}`}
                        onClick={() => { setSortOrder('price-asc'); setSortOpen(false) }}
                      >
                        Price: Low to High
                      </div>
                      <div 
                        className={`px-5 py-3 font-montserrat text-[10px] tracking-[.15em] uppercase cursor-pointer transition-colors ${sortOrder === 'price-desc' ? 'text-[#1a1410] bg-[#1a1410]/5' : 'text-[#1a1410]/60 hover:text-[#1a1410] hover:bg-[#1a1410]/5'}`}
                        onClick={() => { setSortOrder('price-desc'); setSortOpen(false) }}
                      >
                        Price: High to Low
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 w-full">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} isShopPage={true} />
            ))}
          </div>

          {/* View More CTA */}
          <div className="text-center mt-[44px]">
            <p className="font-montserrat text-[10px] tracking-[.14em] collection-sub-color">
              {loadingProducts ? 'Syncing latest creations...' : `Showing ${filteredProducts.length} of ${products.length} creations`}
            </p>
          </div>
        </div>
      </section>

      {/* Social Marquee Section */}
      <SocialMarquee />
    </>
  )
}
