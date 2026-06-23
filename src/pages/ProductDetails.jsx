import React, { useEffect, useState, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../store/cartSlice'
import { products as fallbackProducts } from '../data/products'
import ProductCard from '../components/ProductCard'
import { productAPI } from '../services/api'

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

const formatDisplayPrice = (price) => {
  if (typeof price === 'string' && price.trim().startsWith('₹')) return price
  return `₹${price}`
}

export default function ProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [allProducts, setAllProducts] = useState(fallbackProducts)
  const [loadingProduct, setLoadingProduct] = useState(true)
  const [heroVisible, setHeroVisible] = useState(false)

  // UI States
  const [activeImage, setActiveImage] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [size, setSize] = useState('50ml')
  const [zoomStyle, setZoomStyle] = useState({ transformOrigin: 'center center', transform: 'scale(1)' })
  const [showStickyCart, setShowStickyCart] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const cartItems = useSelector(state => state.cart.items)
  const heroRef = useRef(null)
  
  // Check if current variant is already in cart
  const isAdded = product ? cartItems.some(item => item.id === product.id && item.size === size) : false
  
  const handleAddToCart = () => {
    if (isAdded) {
      navigate('/checkout')
      return
    }

    if (product) {
      // Parse string price like '₹4,800' to a number 4800
      const rawPrice = typeof product.price === 'string' 
        ? Number(product.price.replace(/[^0-9.-]+/g, '')) 
        : product.price;

      dispatch(addToCart({
        id: product.id,
        name: product.name,
        price: rawPrice || 0,
        image: activeImage,
        size,
        quantity
      }))
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    let isMounted = true

    const loadProduct = async () => {
      setLoadingProduct(true)
      try {
        const [apiProduct, apiProducts] = await Promise.all([
          productAPI.getProduct(id),
          productAPI.getProducts({ limit: 100 }),
        ])

        if (!isMounted) return

        const syncedProducts = Array.isArray(apiProducts) && apiProducts.length ? apiProducts : fallbackProducts
        const resolvedProduct = apiProduct || syncedProducts.find(prod => prod.id?.toString() === id)

        setAllProducts(syncedProducts)
        setProduct(resolvedProduct || null)
        if (resolvedProduct) {
          setActiveImage(resolvedProduct.imgPrimary || resolvedProduct.image)
          setQuantity(1)
          setSize('50ml')
        }
      } catch (error) {
        if (!isMounted) return
        const fallbackProduct = fallbackProducts.find(prod => prod.id.toString() === id)
        setAllProducts(fallbackProducts)
        setProduct(fallbackProduct || null)
        if (fallbackProduct) {
          setActiveImage(fallbackProduct.imgPrimary || fallbackProduct.image)
          setQuantity(1)
          setSize('50ml')
        }
      } finally {
        if (isMounted) setLoadingProduct(false)
      }
    }

    loadProduct()

    return () => {
      isMounted = false
    }
  }, [id])

  useEffect(() => {
    if (!product) return;
    
    const timer = setTimeout(() => setHeroVisible(true), 100)
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyCart(!entry.isIntersecting)
      },
      { threshold: 0 }
    )

    if (heroRef.current) {
      observer.observe(heroRef.current)
    }
    
    return () => {
      clearTimeout(timer)
      if (heroRef.current) observer.unobserve(heroRef.current)
    }
  }, [product])

  if (loadingProduct) {
    return (
      <div className="pt-40 pb-32 text-center">
        <h1 className="font-cormorant text-[32px] text-[#1a1410] mb-4">Loading Product...</h1>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="pt-40 pb-32 text-center">
        <h1 className="font-cormorant text-[32px] text-[#1a1410] mb-4">Product Not Found</h1>
        <Link to="/shop" className="font-montserrat text-[10px] tracking-[.2em] uppercase text-[#c9a96e] border-b border-[#c9a96e] pb-1">
          Return to Shop
        </Link>
      </div>
    )
  }

  const relatedProducts = allProducts.filter(p => p.id !== product.id).slice(0, 8)
  const gallery = [product.imgPrimary || product.image, product.imgHover, product.image].filter((img, i, arr) => img && arr.indexOf(img) === i)

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    setZoomStyle({ transformOrigin: `${x}% ${y}%` })
  }

  const handleMouseLeave = () => {
    // Let CSS handle the zoom-out smoothly from the last cursor position
  }

  return (
    <>
      {/* ══ DETAILS HERO ══ */}
      <section ref={heroRef} className="relative w-full overflow-hidden shop-hero-section">
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
              <Link to="/" className="hover:text-[#c9a96e] transition-colors">Home</Link>
              <span className="text-white/40">/</span>
              <Link to="/shop" className="hover:text-[#c9a96e] transition-colors">Shop</Link>
              <span className="text-white/40">/</span>
              <h1 className="text-[#c9a96e] m-0 font-normal inline-block">{product.name}</h1>
            </nav>
          </div>
        </div>
      </section>

      {/* ══ DETAILS CONTENT ══ */}
      <div className="bg-white pt-[72px] pb-16">
        <div className="w-full max-w-[1320px] mx-auto px-4 md:px-8">

          {/* Product Details Section */}
          <div className="flex flex-col md:flex-row gap-12 lg:gap-20 mb-[100px]">
            {/* Image Gallery Left */}
            <div className="w-full md:w-[45%]">
              <div
                className="relative bg-[#f5f5f5] rounded-xl flex items-center justify-center overflow-hidden h-[500px] sm:h-[600px] lg:h-[700px] group"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                {/* Main Image */}
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-[1.12] cursor-crosshair"
                  style={{
                    ...zoomStyle,
                    transition: 'transform 2.5s cubic-bezier(0.2, 0.8, 0.2, 1), transform-origin 1.5s cubic-bezier(0.2, 0.8, 0.2, 1)'
                  }}
                />

                {/* Floating Thumbnails (Figma Style) */}
                {gallery.length > 1 && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                    {gallery.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImage(img)}
                        className={`flex-shrink-0 w-12 h-14 bg-[#f5f5f5] rounded-lg p-1 flex items-center justify-center transition-all overflow-hidden ${activeImage === img ? 'border-2 border-[#3b82f6] shadow-sm' : 'border border-transparent hover:border-gray-300'}`}
                      >
                        <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Info Right */}
            <div className="w-full md:w-[55%] flex flex-col justify-center">
              <div className="flex items-center gap-[2px] text-[#c9a96e] text-[10px] mb-6">
                <i className="fa-solid fa-star" />
                <i className="fa-solid fa-star" />
                <i className="fa-solid fa-star" />
                <i className="fa-solid fa-star" />
                <i className="fa-solid fa-star" />
                <span className="ml-2 font-montserrat tracking-[.2em] text-[#1a1410]/40 uppercase text-[9px]">(128 Reviews)</span>
              </div>

              <h1 className="font-cormorant text-[42px] sm:text-[48px] lg:text-[64px] font-light leading-none text-[#1a1410] mb-4">
                {product.name}
              </h1>

              <p className="font-cormorant text-[32px] sm:text-[36px] text-[#c9a96e] mb-8">
                {formatDisplayPrice(product.price)}
              </p>

              <p className="font-montserrat text-[13px] leading-[1.8] text-[#1a1410]/70 mb-10">
                {product.desc}
                <br /><br />
                Experience the pinnacle of luxury with {product.name}. This exclusive composition opens with bright, inviting top notes before revealing a heart of profound complexity. Crafted for those who appreciate the artistry of fine perfumery.
              </p>

              {/* Size Selector */}
              <div className="mb-8">
                <p className="font-montserrat text-[10px] tracking-[.15em] uppercase text-[#1a1410] mb-3">Bottle Size</p>
                <div className="flex gap-3">
                  {['50ml', '100ml'].map(s => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`px-8 py-3 rounded-sm font-montserrat text-[10px] tracking-[.15em] uppercase transition-colors border ${size === s ? 'border-[#c9a96e] bg-[#c9a96e]/10 text-[#c9a96e]' : 'border-[#1a1410]/20 text-[#1a1410]/60 hover:border-[#1a1410]/40'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                {/* Quantity */}
                <div className="flex items-center justify-between border border-[#1a1410]/20 rounded-sm w-full sm:w-32">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-5 py-4 text-[#1a1410]/60 hover:text-[#c9a96e] transition-colors"><i className="fa-solid fa-minus text-[10px]" /></button>
                  <span className="font-montserrat text-[12px] font-medium text-[#1a1410]">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-5 py-4 text-[#1a1410]/60 hover:text-[#c9a96e] transition-colors"><i className="fa-solid fa-plus text-[10px]" /></button>
                </div>

                {/* Add to Cart / Checkout */}
                <button 
                  onClick={handleAddToCart}
                  className={`flex-1 text-white font-montserrat text-[11px] tracking-[.2em] uppercase px-12 py-5 rounded-sm shadow-xl transition-colors ${isAdded ? 'bg-[#c9a96e] hover:bg-[#b0935d]' : 'bg-[#1a1410] hover:bg-[#c9a96e]'}`}
                >
                  {isAdded ? 'Proceed to Checkout' : 'Add to Cart'}
                </button>
              </div>

              {/* Accordion Details */}
              <div className="border-t border-[#1a1410]/10 pt-4 flex flex-col">
                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer list-none font-montserrat text-[10px] tracking-[.15em] uppercase text-[#1a1410] py-4 border-b border-[#1a1410]/5 transition hover:text-[#c9a96e]">
                    Olfactory Notes
                    <span className="transition group-open:rotate-180 text-[#1a1410]/40">
                      <i className="fa-solid fa-chevron-down text-[10px]" />
                    </span>
                  </summary>
                  <div className="text-[#1a1410]/70 font-montserrat text-[12px] leading-relaxed py-5 bg-[#fcfaf8] px-4 my-2 border border-[#1a1410]/5 rounded-sm">
                    <p><strong className="font-medium text-[#1a1410]">Top Notes:</strong> Bergamot, Pink Pepper</p>
                    <p className="my-1"><strong className="font-medium text-[#1a1410]">Heart Notes:</strong> {product.name.includes('Rose') ? 'Bulgarian Rose, Jasmine' : 'Oud, Cedarwood'}</p>
                    <p><strong className="font-medium text-[#1a1410]">Base Notes:</strong> Amber, Vanilla, Musk</p>
                  </div>
                </details>

                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer list-none font-montserrat text-[10px] tracking-[.15em] uppercase text-[#1a1410] py-4 border-b border-[#1a1410]/5 transition hover:text-[#c9a96e]">
                    Ingredients & Care
                    <span className="transition group-open:rotate-180 text-[#1a1410]/40">
                      <i className="fa-solid fa-chevron-down text-[10px]" />
                    </span>
                  </summary>
                  <div className="text-[#1a1410]/70 font-montserrat text-[12px] leading-relaxed py-5 bg-[#fcfaf8] px-4 my-2 border border-[#1a1410]/5 rounded-sm">
                    Crafted with rare botanical extracts. Keep away from direct sunlight and heat to preserve the integrity of the scent.
                  </div>
                </details>

                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer list-none font-montserrat text-[10px] tracking-[.15em] uppercase text-[#1a1410] py-4 border-b border-[#1a1410]/5 transition hover:text-[#c9a96e]">
                    Shipping & Returns
                    <span className="transition group-open:rotate-180 text-[#1a1410]/40">
                      <i className="fa-solid fa-chevron-down text-[10px]" />
                    </span>
                  </summary>
                  <div className="text-[#1a1410]/70 font-montserrat text-[12px] leading-relaxed py-5 bg-[#fcfaf8] px-4 my-2 border border-[#1a1410]/5 rounded-sm">
                    Complimentary luxury gift packaging and shipping on all orders. Returns accepted within 14 days of purchase.
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>

        {/* Full Width Trust Badges */}
        <div className="w-full bg-white py-10 border-y border-[#1a1410]/5">
          <div className="max-w-[1320px] mx-auto px-4 md:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-[#1a1410]/5">
              <div className="flex flex-col items-center text-center px-4">
                <i className="fa-solid fa-truck-fast text-[22px] text-[#c9a96e] mb-4" />
                <h4 className="font-montserrat text-[10px] font-semibold tracking-[.2em] uppercase text-[#1a1410] mb-2">Fast Shipping</h4>
                <p className="font-montserrat text-[10px] leading-relaxed text-[#1a1410]/60 max-w-[200px] mx-auto">Express & standard delivery available.</p>
              </div>
              <div className="flex flex-col items-center text-center px-4">
                <i className="fa-solid fa-arrow-rotate-left text-[22px] text-[#c9a96e] mb-4" />
                <h4 className="font-montserrat text-[10px] font-semibold tracking-[.2em] uppercase text-[#1a1410] mb-2">Easy Returns</h4>
                <p className="font-montserrat text-[10px] leading-relaxed text-[#1a1410]/60 max-w-[200px] mx-auto">Seamless returns within 14 days.</p>
              </div>
              <div className="flex flex-col items-center text-center px-4">
                <i className="fa-solid fa-certificate text-[22px] text-[#c9a96e] mb-4" />
                <h4 className="font-montserrat text-[10px] font-semibold tracking-[.2em] uppercase text-[#1a1410] mb-2">Authentic</h4>
                <p className="font-montserrat text-[10px] leading-relaxed text-[#1a1410]/60 max-w-[200px] mx-auto">100% verified premium quality.</p>
              </div>
              <div className="flex flex-col items-center text-center px-4">
                <i className="fa-solid fa-leaf text-[22px] text-[#c9a96e] mb-4" />
                <h4 className="font-montserrat text-[10px] font-semibold tracking-[.2em] uppercase text-[#1a1410] mb-2">Cruelty Free</h4>
                <p className="font-montserrat text-[10px] leading-relaxed text-[#1a1410]/60 max-w-[200px] mx-auto">Ethically sourced, never tested on animals.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Full Screen Mid-Page Banner */}
        <div className="w-full h-[300px] md:h-[400px] lg:h-[50vh] overflow-hidden">
          <img
            src="/img/hero/shopbnr3.png"
            alt="Signature Collection"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Related Products Slider */}
        <section className="w-full bg-[#fcfaf8] pt-[80px]">
          <div className="text-center mb-[48px] px-4">
            <p className="font-montserrat text-[10px] tracking-[.40em] uppercase mb-2 text-[#c9a96e]">
              Discover More
            </p>
            <h2 className="font-cormorant font-light text-[42px] tracking-[.06em] text-[#1a1410] mb-6">
              Related Signatures
            </h2>
          </div>

          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={0}
            slidesPerView={1}
            centerInsufficientSlides={true}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 5 },
            }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            className="w-full"
          >
            {relatedProducts.map(prod => (
              <SwiperSlide key={prod.id}>
                <ProductCard product={prod} />
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      </div>

      {/* Sticky Bottom Add To Cart Bar */}
      <div 
        className={`fixed bottom-0 left-0 w-full bg-white shadow-[0_-10px_30px_rgba(0,0,0,0.06)] z-50 transition-transform duration-500 ease-out border-t border-[#1a1410]/5 ${showStickyCart ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="w-full max-w-[1320px] mx-auto px-4 md:px-8 py-3 flex items-center justify-between gap-4">
          
          {/* Left: Product Info (Hidden on small screens) */}
          <div className="hidden sm:flex items-center gap-4">
            <img src={activeImage} alt={product.name} className="w-12 h-14 object-cover rounded border border-[#1a1410]/5" />
            <div>
              <h4 className="font-cormorant font-semibold text-[20px] text-[#1a1410] m-0 leading-tight">{product.name}</h4>
              <p className="font-montserrat text-[12px] font-medium text-[#c9a96e] mt-1">{formatDisplayPrice(product.price)}</p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            
            {/* Size Indicator (Optional) */}
            <span className="hidden md:inline-block font-montserrat text-[11px] font-medium text-[#1a1410]/60 mr-2">
              Size: {size}
            </span>

            {/* Quantity Counter */}
            <div className="flex items-center border border-[#1a1410]/10 rounded-sm overflow-hidden h-10">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-full flex items-center justify-center text-[#1a1410]/60 hover:text-[#1a1410] hover:bg-[#fcfaf8] transition"
              >
                <i className="fa-solid fa-minus text-[10px]" />
              </button>
              <span className="w-10 text-center font-montserrat text-[12px] font-medium text-[#1a1410]">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-full flex items-center justify-center text-[#1a1410]/60 hover:text-[#1a1410] hover:bg-[#fcfaf8] transition"
              >
                <i className="fa-solid fa-plus text-[10px]" />
              </button>
            </div>

            {/* Add to Cart / Checkout Button */}
            <button 
              onClick={handleAddToCart}
              className={`text-white font-montserrat text-[10px] font-semibold tracking-[.2em] uppercase px-8 h-10 transition-colors whitespace-nowrap flex items-center justify-center gap-2 ${isAdded ? 'bg-[#c9a96e] hover:bg-[#b0935d]' : 'bg-[#1a1410] hover:bg-[#c9a96e]'}`}
            >
              {isAdded ? 'Checkout' : 'Add to Cart'} 
              <i className={`fa-solid ${isAdded ? 'fa-arrow-right' : 'fa-bag-shopping'}`} />
            </button>
          </div>

        </div>
      </div>
    </>
  )
}
