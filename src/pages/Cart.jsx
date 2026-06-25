import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import CartItem from '../components/cart/CartItem'
import { clearCart } from '../store/cartSlice'

export default function Cart() {
  const { items, totalPrice } = useSelector(state => state.cart)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [heroVisible, setHeroVisible] = useState(false)
  const heroRef = useRef(null)

  const [coupon, setCoupon] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    const timer = setTimeout(() => setHeroVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleApplyCoupon = (e) => {
    e.preventDefault()
    if (coupon.trim().toUpperCase() === 'WELCOME10') {
      setCouponApplied(true)
      alert('Coupon "WELCOME10" applied successfully! 10% discount has been applied.')
    } else if (coupon.trim()) {
      alert('Invalid coupon code. Try using "WELCOME10".')
    } else {
      alert('Please enter a coupon code.')
    }
  }

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your shopping cart?')) {
      dispatch(clearCart())
      setCouponApplied(false)
      setCoupon('')
    }
  }

  const discount = couponApplied ? Math.round(totalPrice * 0.1) : 0
  const finalPrice = totalPrice - discount

  return (
    <>
      {/* ══ CART HERO ══ */}
      <section
        ref={heroRef}
        className="relative w-full overflow-hidden shop-hero-section"
      >
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/img/hero/shopbnr2.png"
            alt="Cart Background"
            className="w-full h-full object-cover object-[center_35%]"
            style={{ transition: 'transform 12s ease-out', transformOrigin: 'center 35%' }}
          />
          {/* Overlay */}
          <div className="absolute inset-0 shop-hero-overlay opacity-50" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full flex flex-col items-center justify-end px-4 pb-12" style={{ minHeight: '60vh' }}>
          {/* Breadcrumb */}
          <div
            className="footer-gold-band backdrop-blur-xl border border-[#c9a96e]/40 shadow-2xl px-6 py-3 rounded-none flex items-center gap-3"
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
                Your Cart
              </h1>
            </nav>
          </div>
        </div>
      </section>

      {/* ══ CART CONTENT ══ */}
      <div className="bg-white py-[72px] w-full min-h-[50vh]">
        <div className="w-full max-w-[1320px] mx-auto px-4 md:px-8">



          {items.length === 0 ? (
            <div className="text-center py-20 px-8 bg-white border border-[#1a1410]/5 shadow-[0_4px_30px_rgba(26,20,16,0.06)] rounded-none max-w-xl mx-auto flex flex-col items-center">
              <div className="w-20 h-20 rounded-none bg-[#fffaf4] border border-[#c9a96e]/20 flex items-center justify-center mb-6 shadow-sm">
                <i className="fa-solid fa-basket-shopping text-3xl text-[#c9a96e]" />
              </div>
              <h2 className="font-cormorant text-[32px] font-semibold text-[#1a1410] mb-3">
                Your pre-book list is empty
              </h2>
              <p className="font-montserrat text-[12px] text-[#1a1410]/50 tracking-wider mb-8 max-w-sm leading-relaxed">
                Select a fragrance to begin your pre-booking. You can confirm it with cash on delivery.
              </p>
              <Link
                to="/shop"
                className="group inline-flex items-center justify-center gap-2.5 bg-[#1a1410] hover:bg-[#c9a96e] text-white hover:text-[#1a1410] font-montserrat text-[11px] font-bold tracking-[.2em] uppercase px-10 py-4 border border-[#1a1410] hover:border-[#c9a96e] transition-all duration-300 rounded-none shadow-[0_4px_15px_rgba(26,20,16,0.15)]"
              >
                Discover Creations
                <i className="fa-solid fa-arrow-right text-[10px] transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          ) : (
            <div>
              {/* Header section with Title and Continue Shopping link */}
              <div className="flex justify-between items-baseline border-b border-[#1a1410]/10 pb-4 mb-8">
                <h2 className="font-cormorant text-[36px] font-semibold text-[#1a1410]">
                  Your Pre-booking
                </h2>
                <Link 
                  to="/shop"
                  className="font-montserrat text-[11px] font-semibold tracking-[.2em] uppercase text-[#1a1410] hover:text-[#c9a96e] transition-all flex items-center gap-2"
                >
                  <i className="fa-solid fa-arrow-left-long text-[10px]" /> Continue Shopping
                </Link>
              </div>

              <div className="flex flex-col lg:flex-row gap-12 items-start">
                {/* Left Column: Cart Table & Coupon Actions */}
                <div className="flex-1 w-full">

                {/* Desktop Table Header (Aligned with Figma layout & theme) */}
                <div 
                  className="hidden md:grid grid-cols-12 items-center gap-4 mb-4 text-white font-montserrat font-bold text-[11px] tracking-[.15em] uppercase py-3.5 px-6 rounded-none shadow-[0_4px_20px_rgba(26,20,16,0.06)] border border-[#c9a96e]/20"
                  style={{ background: 'linear-gradient(120deg, rgba(61,42,16,.70) 0%, rgba(105,74,32,.45) 40%, rgba(45,30,10,.65) 70%, rgba(20,14,6,.50) 100%)' }}
                >
                  <div className="col-span-1"></div> {/* Space for the × column inside the gold bar */}
                  <div className="col-span-11 grid grid-cols-12 gap-4 items-center px-6">
                    <div className="col-span-6">Product</div>
                    <div className="col-span-2 text-center">Price</div>
                    <div className="col-span-2 text-center">Quantity</div>
                    <div className="col-span-2 text-right">Subtotal</div>
                  </div>
                </div>

                {/* Items List (Rendered directly to ensure alignment) */}
                <div className="flex flex-col gap-4 mt-2 mb-6">
                  {items.map((item, index) => (
                    <CartItem key={`${item.id}-${item.size}-${index}`} item={item} />
                  ))}
                </div>

                {/* Coupon Code and Clear Cart Actions (Figma aligned) */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-8 pt-6">
                  <div className="flex flex-row items-center gap-3 w-full sm:w-auto">
                    <input
                      type="text"
                      placeholder="Coupon Code"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      className="w-[150px] xs:w-[180px] sm:w-[200px] border border-[#1a1410]/20 rounded-none px-5 py-2.5 font-montserrat text-xs outline-none focus:border-[#c9a96e] transition-colors bg-white"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="bg-[#1a1410] hover:bg-[#c9a96e] text-white hover:text-[#1a1410] font-montserrat font-bold text-[12px] tracking-[.1em] px-6 py-2.5 rounded-none transition-all duration-300 whitespace-nowrap"
                    >
                      Apply Coupon
                    </button>
                  </div>

                  <button
                    onClick={handleClearCart}
                    className="text-[#1a1410]/60 hover:text-[#c9a96e] transition-colors underline font-montserrat font-semibold text-[12px] tracking-[.1em] cursor-pointer py-2 text-right"
                  >
                    Clear Pre-booking
                  </button>
                </div>

              </div>

              {/* Right Column: Order Summary Sidebar (Aligned with Cart Drawer Theme) */}
              <div className="w-full lg:w-[400px] lg:sticky lg:top-32">
                <div className="border border-[#c9a96e]/20 rounded-none flex flex-col overflow-hidden shadow-2xl relative">
                  {/* Background Image & Overlay matching Cart Drawer */}
                  <div 
                    className="absolute inset-0 z-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url("/img/newsection/three.png")' }}
                  />
                  <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#1a1510]/95 via-[#0a0807]/75 to-[#0f0d0b]/95 backdrop-blur-[2px]" />

                  {/* Header styled same as Cart Drawer Header */}
                  <div 
                    className="px-6 py-4 flex-shrink-0 border-b border-[#c9a96e]/20 relative z-10"
                    style={{ background: 'linear-gradient(120deg, rgba(61,42,16,.70) 0%, rgba(105,74,32,.45) 40%, rgba(45,30,10,.65) 70%, rgba(20,14,6,.50) 100%)' }}
                  >
                    <h3 className="font-montserrat font-semibold text-[15px] tracking-wider text-white uppercase m-0">
                      Pre-book Summary
                    </h3>
                  </div>

                  {/* Body matching Drawer contents and style */}
                  <div className="p-6 md:p-8 flex-1 text-white relative z-10">
                    <div className="space-y-4 font-montserrat text-[13px] text-white/80">
                      <div className="flex justify-between items-center py-2.5 border-b border-white/10">
                        <span className="font-medium text-white/60">Subtotal</span>
                        <span className="font-semibold text-white">₹{totalPrice}</span>
                      </div>
                      {couponApplied && (
                        <div className="flex justify-between items-center py-2.5 border-b border-white/10 text-[#c9a96e]">
                          <span className="font-medium text-white/60">Discount (10%)</span>
                          <span className="font-semibold">-₹{discount}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center py-2.5 border-b border-white/10">
                        <span className="font-medium text-white/60">Shipping</span>
                        <span className="text-[#c9a96e] font-semibold uppercase text-xs tracking-wider">Free</span>
                      </div>
                      <div className="flex justify-between items-end pt-4 mt-2">
                        <span className="text-[14px] font-bold text-white/90 uppercase tracking-wider">Total</span>
                        <span className="text-[24px] font-bold text-[#c9a96e]">₹{finalPrice}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => navigate('/checkout')}
                      className="w-full bg-[#c9a96e] hover:bg-white text-[#1a1410] font-montserrat text-[12px] font-bold tracking-[.2em] py-4 rounded-none transition-colors uppercase mt-8 shadow-md"
                    >
                      Continue Pre-booking
                    </button>

                    <div className="flex justify-center items-center gap-2 mt-6 text-white/50">
                      <i className="fa-solid fa-hand-holding-dollar text-sm" />
                      <span className="font-montserrat text-[9px] uppercase tracking-[.16em]">Cash on delivery only</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>

      {/* ══ BOTTOM FEATURES SECTION (Figma aligned & themed) ══ */}
      <section className="bg-[#fffaf4] border-y border-[#c9a96e]/25 py-14 w-full shadow-sm">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Feature 1: Free Shipping */}
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-none bg-[#c9a96e] text-[#1a1410] flex-shrink-0 flex items-center justify-center shadow-sm">
                <i className="fa-solid fa-box text-xl" />
              </div>
              <div>
                <h4 className="font-montserrat font-bold text-[13px] text-[#1a1410] uppercase tracking-wider">
                  Free Shipping
                </h4>
                <p className="font-montserrat text-[11px] text-[#1a1410]/60 mt-1.5 font-medium">
                  Free shipping for order above ₹15,000
                </p>
              </div>
            </div>

            {/* Feature 2: COD Pre-booking */}
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-none bg-[#c9a96e] text-[#1a1410] flex-shrink-0 flex items-center justify-center shadow-sm">
                <i className="fa-solid fa-wallet text-xl" />
              </div>
              <div>
                <h4 className="font-montserrat font-bold text-[13px] text-[#1a1410] uppercase tracking-wider">
                  COD Pre-booking
                </h4>
                <p className="font-montserrat text-[11px] text-[#1a1410]/60 mt-1.5 font-medium">
                  Reserve now and pay cash on delivery
                </p>
              </div>
            </div>

            {/* Feature 3: 24x7 Support */}
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-none bg-[#c9a96e] text-[#1a1410] flex-shrink-0 flex items-center justify-center shadow-sm">
                <i className="fa-solid fa-headset text-xl" />
              </div>
              <div>
                <h4 className="font-montserrat font-bold text-[13px] text-[#1a1410] uppercase tracking-wider">
                  24x7 Support
                </h4>
                <p className="font-montserrat text-[11px] text-[#1a1410]/60 mt-1.5 font-medium">
                  We support online all days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
