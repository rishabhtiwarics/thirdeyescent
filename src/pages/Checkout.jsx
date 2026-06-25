import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { setShippingDetails, setPaymentStatus, setOrderId, resetCheckout } from '../store/checkoutSlice'
import { clearCart } from '../store/cartSlice'
import { orderAPI } from '../services/api'

export default function Checkout() {
  const { items, totalPrice } = useSelector(state => state.cart)
  const { paymentStatus, orderId } = useSelector(state => state.checkout)
  const { isAuthenticated } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Wizard Step
  const [step, setStep] = useState(1) // 1: Address, 2: Payment, 3: Review

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    zipCode: '',
    paymentMethod: 'cod',
  })

  const [heroVisible, setHeroVisible] = useState(false)
  const heroRef = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    // If cart is empty and checkout hasn't succeeded, send back to cart
    if (items.length === 0 && paymentStatus !== 'success') {
      navigate('/cart')
    }
    const timer = setTimeout(() => setHeroVisible(true), 100)
    return () => clearTimeout(timer)
  }, [items, navigate, paymentStatus])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Next step validation
  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.email) {
        alert('Please enter your email address.')
        return
      }
      setStep(2)
    } else if (step === 2) {
      if (!formData.firstName || !formData.lastName || !formData.address || !formData.city || !formData.state || !formData.zipCode) {
        alert('Please fill out all shipping address fields.')
        return
      }
      if (!/^\d{6}$/.test(formData.zipCode)) {
        alert('Please enter a valid 6 digit PIN code.')
        return
      }
      setStep(3)
    }
  }

  const handlePrevStep = () => {
    setStep(prev => Math.max(1, prev - 1))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isAuthenticated) {
      alert('Please sign in before confirming your pre-booking.')
      navigate('/login')
      return
    }

    dispatch(setPaymentStatus('processing'))

    try {
      const orderPayload = {
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        shippingAddress: {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          addressLine1: formData.address,
          city: formData.city,
          state: formData.state,
          pinCode: formData.zipCode,
          country: formData.country,
        },
        paymentMethod: 'cod',
      }

      const order = await orderAPI.createOrder(orderPayload)
      completeOrder(order)
    } catch (error) {
      dispatch(setPaymentStatus('failed'))
      alert(error.message || 'Failed to confirm pre-booking')
    }
  }

  const completeOrder = (order) => {
    dispatch(setShippingDetails({
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      zipCode: formData.zipCode
    }))
    dispatch(setOrderId(order?._id || order?.id || 'ORDER-CREATED'))
    dispatch(setPaymentStatus('success'))
    dispatch(clearCart())
  }

  const handleFinish = () => {
    dispatch(resetCheckout())
    navigate('/')
  }

  if (items.length === 0 && paymentStatus !== 'success') return null

  // Loading Overlay
  if (paymentStatus === 'processing') {
    return (
      <div className="fixed inset-0 bg-[#1a1410]/95 backdrop-blur-md z-[1000] flex flex-col items-center justify-center text-white">
        <div className="relative w-20 h-20 mb-8">
          {/* Animated Gold Ring Spinner */}
          <div className="absolute inset-0 rounded-none border-[3px] border-[#c9a96e]/20" />
          <div className="absolute inset-0 rounded-none border-[3px] border-t-[#c9a96e] animate-spin" />
        </div>
        <h2 className="font-cormorant text-[28px] tracking-widest uppercase mb-2">Confirming Pre-booking</h2>
        <p className="font-montserrat text-xs text-white/50 tracking-wider">Please do not refresh or close the page...</p>
      </div>
    )
  }

  // Success Screen
  if (paymentStatus === 'success') {
    return (
      <div className="bg-white py-24 min-h-[80vh] flex items-center justify-center">
        <div className="max-w-xl w-full mx-auto px-6 text-center">
          <div className="text-center py-16 px-8 bg-white border border-[#1a1410]/5 shadow-[0_4px_30px_rgba(26,20,16,0.06)] rounded-none flex flex-col items-center">
            <div className="w-20 h-20 rounded-none bg-[#fffaf4] border border-[#c9a96e]/20 flex items-center justify-center mb-6 shadow-sm">
              <i className="fa-solid fa-circle-check text-4xl text-[#c9a96e]" />
            </div>
            <h2 className="font-cormorant text-[36px] font-semibold text-[#1a1410] mb-3">Pre-booking Confirmed</h2>
            <p className="font-montserrat text-xs text-[#1a1410]/50 tracking-wider mb-6 leading-relaxed max-w-sm">
              Your fragrance has been reserved. Payment will be collected by cash on delivery.
            </p>
            <div className="bg-[#fffaf4] border border-[#c9a96e]/25 px-6 py-4 mb-8 rounded-none w-full max-w-md">
              <span className="block font-montserrat text-[10px] uppercase tracking-widest text-[#1a1410]/40 mb-1">Pre-booking ID</span>
              <span className="font-montserrat text-sm font-bold tracking-wider text-[#1a1410]">{orderId}</span>
            </div>
            <button
              onClick={handleFinish}
              className="inline-block bg-[#1a1410] hover:bg-[#c9a96e] text-white hover:text-[#1a1410] font-montserrat text-[11px] font-bold tracking-[.2em] uppercase px-12 py-4 border border-[#1a1410] hover:border-[#c9a96e] transition-all duration-300 rounded-none shadow-[0_4px_15px_rgba(26,20,16,0.15)]"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* ══ CHECKOUT HERO ══ */}
      <section
        ref={heroRef}
        className="relative w-full overflow-hidden shop-hero-section"
      >
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/img/hero/shopbnr2.png"
            alt="Checkout Background"
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
            className="footer-gold-band backdrop-blur-xl border border-[#c9a96e]/40 shadow-2xl px-6 py-3 rounded-sm flex items-center gap-3"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateX(0)' : 'translateX(-28px)',
              transition: 'opacity 0.6s ease, transform 0.6s ease',
              transitionDelay: '0.2s'
            }}
          >
            <nav className="flex items-center gap-3 font-montserrat text-[10px] tracking-[.25em] uppercase text-white/80">
              <Link to="/cart" className="hover:text-[#c9a96e] transition-colors">
                Pre-book
              </Link>
              <span className="text-white/40">/</span>
              <h1 className="text-[#c9a96e] m-0 font-normal inline-block">
                Confirm Pre-booking
              </h1>
            </nav>
          </div>
        </div>
      </section>

      {/* ══ CHECKOUT CONTENT ══ */}
      <div className="bg-white py-[72px] w-full min-h-[50vh]">
        <div className="w-full max-w-[1320px] mx-auto px-4 md:px-8">

          {/* Header section with Title and Back to Cart link (Aligned with Cart page) */}
          <div className="flex justify-between items-baseline border-b border-[#1a1410]/10 pb-4 mb-8">
            <h2 className="font-cormorant text-[36px] font-semibold text-[#1a1410]">
              Confirm Pre-booking
            </h2>
            <Link 
              to="/cart"
              className="font-montserrat text-[11px] font-semibold tracking-[.2em] uppercase text-[#1a1410] hover:text-[#c9a96e] transition-all flex items-center gap-2"
            >
              <i className="fa-solid fa-arrow-left-long text-[10px]" /> Back to Pre-booking
            </Link>
          </div>

          <div className="flex flex-col-reverse lg:flex-row gap-12 items-start">

            {/* Left Column: 3-Step Wizard Form */}
            <div className="flex-1 w-full">

              {/* Step indicator header */}
              <div className="grid grid-cols-3 gap-4 mb-10 select-none">
                {/* Step 1 Indicator */}
                <div 
                  className={`pb-4 border-b-2 transition-all duration-300 font-montserrat text-[10px] sm:text-[11px] tracking-[.2em] uppercase font-bold text-center ${
                    step === 1 
                      ? 'border-[#c9a96e] text-[#1a1410]' 
                      : 'border-[#1a1410]/10 text-[#1a1410]/40'
                  }`}
                >
                  <span className="mr-2 text-[8px] opacity-60">01</span>
                  <span>Identify</span>
                </div>
                
                {/* Step 2 Indicator */}
                <div 
                  className={`pb-4 border-b-2 transition-all duration-300 font-montserrat text-[10px] sm:text-[11px] tracking-[.2em] uppercase font-bold text-center ${
                    step === 2 
                      ? 'border-[#c9a96e] text-[#1a1410]' 
                      : 'border-[#1a1410]/10 text-[#1a1410]/40'
                  }`}
                >
                  <span className="mr-2 text-[8px] opacity-60">02</span>
                  <span>Address</span>
                </div>
                
                {/* Step 3 Indicator */}
                <div 
                  className={`pb-4 border-b-2 transition-all duration-300 font-montserrat text-[10px] sm:text-[11px] tracking-[.2em] uppercase font-bold text-center ${
                    step === 3 
                      ? 'border-[#c9a96e] text-[#1a1410]' 
                      : 'border-[#1a1410]/10 text-[#1a1410]/40'
                  }`}
                >
                  <span className="mr-2 text-[8px] opacity-60">03</span>
                  <span>Confirmation</span>
                </div>
              </div>

              {/* Form container card wrapper with shadow & border */}
              <div className="bg-white p-6 md:p-10 border border-[#1a1410]/5 shadow-[0_4px_30px_rgba(26,20,16,0.06)] rounded-none">
                {/* Wizard Content */}
                <form onSubmit={handleSubmit}>

                {/* STEP 1: IDENTIFY */}
                {step === 1 && (
                  <div className="space-y-6 animate-fadeIn">
                    <div>
                      <h3 className="font-cormorant text-[20px] font-semibold text-[#1a1410] border-b border-[#1a1410]/5 pb-2 mb-6 uppercase tracking-wider">Contact Information</h3>
                      <div>
                        <label className="font-montserrat text-[9px] uppercase tracking-[.15em] text-[#1a1410]/50 font-bold mb-1.5 block">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full border border-[#1a1410]/15 rounded-none px-4 py-3 font-montserrat text-xs outline-none focus:border-[#c9a96e] focus:bg-white focus:ring-1 focus:ring-[#c9a96e] bg-[#fffaf4]/30 text-[#1a1410] placeholder-[#1a1410]/25 transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="group inline-flex items-center gap-2.5 bg-[#1a1410] hover:bg-[#c9a96e] text-white hover:text-[#1a1410] font-montserrat text-[11px] font-bold tracking-[.2em] uppercase px-10 py-4 border border-[#1a1410] hover:border-[#c9a96e] transition-all duration-300 rounded-none"
                      >
                        Continue to Address
                        <i className="fa-solid fa-arrow-right text-[10px] transition-transform duration-300 group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: ADDRESS */}
                {step === 2 && (
                  <div className="space-y-6 animate-fadeIn">
                    <div>
                      <h3 className="font-cormorant text-[20px] font-semibold text-[#1a1410] border-b border-[#1a1410]/5 pb-2 mb-6 uppercase tracking-wider">Shipping Address</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                        <div>
                          <label className="font-montserrat text-[9px] uppercase tracking-[.15em] text-[#1a1410]/50 font-bold mb-1.5 block">First Name</label>
                          <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} className="w-full border border-[#1a1410]/15 rounded-none px-4 py-3 font-montserrat text-xs outline-none focus:border-[#c9a96e] focus:bg-white focus:ring-1 focus:ring-[#c9a96e] bg-[#fffaf4]/30 text-[#1a1410] placeholder-[#1a1410]/25 transition-all duration-200" />
                        </div>
                        <div>
                          <label className="font-montserrat text-[9px] uppercase tracking-[.15em] text-[#1a1410]/50 font-bold mb-1.5 block">Last Name</label>
                          <input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} className="w-full border border-[#1a1410]/15 rounded-none px-4 py-3 font-montserrat text-xs outline-none focus:border-[#c9a96e] focus:bg-white focus:ring-1 focus:ring-[#c9a96e] bg-[#fffaf4]/30 text-[#1a1410] placeholder-[#1a1410]/25 transition-all duration-200" />
                        </div>
                      </div>
                      <div className="mb-5">
                        <label className="font-montserrat text-[9px] uppercase tracking-[.15em] text-[#1a1410]/50 font-bold mb-1.5 block">Street Address</label>
                        <input type="text" name="address" required value={formData.address} onChange={handleChange} className="w-full border border-[#1a1410]/15 rounded-none px-4 py-3 font-montserrat text-xs outline-none focus:border-[#c9a96e] focus:bg-white focus:ring-1 focus:ring-[#c9a96e] bg-[#fffaf4]/30 text-[#1a1410] placeholder-[#1a1410]/25 transition-all duration-200" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div>
                          <label className="font-montserrat text-[9px] uppercase tracking-[.15em] text-[#1a1410]/50 font-bold mb-1.5 block">City</label>
                          <input type="text" name="city" required value={formData.city} onChange={handleChange} className="w-full border border-[#1a1410]/15 rounded-none px-4 py-3 font-montserrat text-xs outline-none focus:border-[#c9a96e] focus:bg-white focus:ring-1 focus:ring-[#c9a96e] bg-[#fffaf4]/30 text-[#1a1410] placeholder-[#1a1410]/25 transition-all duration-200" />
                        </div>
                        <div>
                          <label className="font-montserrat text-[9px] uppercase tracking-[.15em] text-[#1a1410]/50 font-bold mb-1.5 block">State</label>
                          <input type="text" name="state" required value={formData.state} onChange={handleChange} className="w-full border border-[#1a1410]/15 rounded-none px-4 py-3 font-montserrat text-xs outline-none focus:border-[#c9a96e] focus:bg-white focus:ring-1 focus:ring-[#c9a96e] bg-[#fffaf4]/30 text-[#1a1410] placeholder-[#1a1410]/25 transition-all duration-200" />
                        </div>
                        <div>
                          <label className="font-montserrat text-[9px] uppercase tracking-[.15em] text-[#1a1410]/50 font-bold mb-1.5 block">Country</label>
                          <div className="relative">
                            <select name="country" value={formData.country} onChange={handleChange} className="w-full border border-[#1a1410]/15 rounded-none px-4 py-3 font-montserrat text-xs outline-none focus:border-[#c9a96e] focus:bg-white focus:ring-1 focus:ring-[#c9a96e] bg-[#fffaf4]/30 text-[#1a1410] appearance-none pr-10 transition-all duration-200">
                              <option value="India">India</option>
                              <option value="United States">United States</option>
                              <option value="Canada">Canada</option>
                              <option value="United Kingdom">United Kingdom</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#1a1410]/60">
                              <i className="fa-solid fa-chevron-down text-[10px]" />
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="font-montserrat text-[9px] uppercase tracking-[.15em] text-[#1a1410]/50 font-bold mb-1.5 block">PIN Code</label>
                          <input type="text" name="zipCode" required value={formData.zipCode} onChange={handleChange} className="w-full border border-[#1a1410]/15 rounded-none px-4 py-3 font-montserrat text-xs outline-none focus:border-[#c9a96e] focus:bg-white focus:ring-1 focus:ring-[#c9a96e] bg-[#fffaf4]/30 text-[#1a1410] placeholder-[#1a1410]/25 transition-all duration-200" />
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-between">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="group inline-flex items-center gap-2.5 bg-transparent hover:bg-[#1a1410]/5 text-[#1a1410] font-montserrat text-[11px] font-bold tracking-[.2em] uppercase px-8 py-4 border border-[#1a1410]/20 transition-all duration-300 rounded-none"
                      >
                        <i className="fa-solid fa-arrow-left text-[10px] transition-transform duration-300 group-hover:-translate-x-1" />
                        Back
                      </button>

                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="group inline-flex items-center gap-2.5 bg-[#1a1410] hover:bg-[#c9a96e] text-white hover:text-[#1a1410] font-montserrat text-[11px] font-bold tracking-[.2em] uppercase px-10 py-4 border border-[#1a1410] hover:border-[#c9a96e] transition-all duration-300 rounded-none"
                      >
                        Review Pre-booking
                        <i className="fa-solid fa-arrow-right text-[10px] transition-transform duration-300 group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: COD CONFIRMATION */}
                {step === 3 && (
                  <div className="space-y-6 animate-fadeIn">
                    <div>
                      <h3 className="font-cormorant text-[20px] font-semibold text-[#1a1410] border-b border-[#1a1410]/5 pb-2 mb-2 uppercase tracking-wider">Pre-booking Confirmation</h3>
                      <p className="font-montserrat text-[11px] text-[#1a1410]/40 tracking-wider mb-6">Online payment is temporarily unavailable. Cash on delivery is the only payment method.</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        {/* Left Column: Payment Method */}
                        <div className="border border-[#1a1410]/10 rounded-none p-6 space-y-4 bg-[#fffaf4]/20">
                          <div className="flex items-center justify-between border-b border-[#1a1410]/10 pb-4 mb-2">
                            <span className="font-montserrat text-[10px] font-bold text-[#1a1410] uppercase tracking-widest">Payment Method</span>
                            <i className="fa-solid fa-hand-holding-dollar text-lg text-[#c9a96e]" />
                          </div>

                          <div className="block border border-[#c9a96e] bg-white p-5 shadow-[0_12px_30px_rgba(201,169,110,0.18)]">
                            <span className="flex items-start gap-4">
                              <span className="mt-1 flex h-5 w-5 items-center justify-center border border-[#c9a96e] rounded-full">
                                <span className="h-2.5 w-2.5 rounded-full bg-[#c9a96e]" />
                              </span>
                              <span className="flex-1">
                                <span className="flex items-center justify-between gap-3">
                                  <span className="font-cormorant text-[22px] font-semibold text-[#1a1410]">Cash on Delivery</span>
                                  <span className="font-montserrat text-[8px] font-bold uppercase tracking-[.18em] text-[#c9a96e]">Only option</span>
                                </span>
                                <span className="mt-1 block font-montserrat text-[11px] leading-relaxed text-[#1a1410]/55">
                                  Confirm your pre-booking now and pay in cash when the shipment arrives.
                                </span>
                              </span>
                            </span>
                          </div>
                        </div>

                        {/* Right Column: Address and Identity Review Summary */}
                        <div className="space-y-6">
                          <div className="border border-[#1a1410]/15 rounded-none p-6 bg-[#fffaf4]/25">
                            <h4 className="font-montserrat text-[10px] font-bold uppercase tracking-wider text-[#1a1410]/50 mb-3">Shipping Address</h4>
                            <p className="font-montserrat text-xs font-semibold text-[#1a1410]">{formData.firstName} {formData.lastName}</p>
                            <p className="font-montserrat text-xs text-[#1a1410]/70 mt-1">{formData.address}</p>
                            <p className="font-montserrat text-xs text-[#1a1410]/70">{formData.city}, {formData.state} {formData.zipCode}</p>
                            <p className="font-montserrat text-xs text-[#1a1410]/70">{formData.country}</p>
                            <div className="border-t border-[#1a1410]/5 mt-4 pt-3">
                              <span className="font-montserrat text-[9px] uppercase tracking-wider text-[#1a1410]/40 block mb-1">Email Address</span>
                              <p className="font-montserrat text-xs text-[#1a1410]/80 font-semibold">{formData.email}</p>
                            </div>
                          </div>

                          <div className="border border-[#1a1410]/10 rounded-none p-5 bg-[#fffaf4]/10 flex items-center gap-3 text-[#c9a96e]">
                            <i className="fa-solid fa-shield-halved text-lg" />
                            <div>
                              <span className="font-montserrat text-[9px] uppercase tracking-wider font-bold block">Reserved securely</span>
                              <span className="font-montserrat text-[9px] text-[#1a1410]/50 block">No online payment is required today</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-between">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="group inline-flex items-center gap-2.5 bg-transparent hover:bg-[#1a1410]/5 text-[#1a1410] font-montserrat text-[11px] font-bold tracking-[.2em] uppercase px-8 py-4 border border-[#1a1410]/20 transition-all duration-300 rounded-none"
                      >
                        <i className="fa-solid fa-arrow-left text-[10px] transition-transform duration-300 group-hover:-translate-x-1" />
                        Back
                      </button>

                      <button
                        type="submit"
                        className="group inline-flex items-center gap-2.5 bg-[#c9a96e] hover:bg-[#1a1410] text-[#1a1410] hover:text-white font-montserrat text-[11px] font-bold tracking-[.2em] uppercase px-12 py-4 border border-[#c9a96e] hover:border-[#1a1410] transition-all duration-300 rounded-none"
                      >
                        Confirm COD Pre-book (₹{totalPrice})
                        <i className="fa-solid fa-circle-check text-[10px]" />
                      </button>
                    </div>
                  </div>
                )}
                </form>
              </div>
            </div>

            {/* Right Column: Order Summary Sidebar (Aligned with Cart Drawer Theme) */}
            <div className="w-full lg:w-[420px] lg:sticky lg:top-32">
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
                  <h3 className="font-montserrat font-semibold text-[14px] tracking-wider text-white uppercase m-0">
                    Your Pre-book
                  </h3>
                </div>

                {/* Body matching Drawer contents and style */}
                <div className="p-6 md:p-8 flex-1 text-white relative z-10">

                  {/* Items Scrollable List */}
                  <div className="space-y-5 max-h-[36vh] overflow-y-auto pr-2 custom-scrollbar">
                    {items.map((item, index) => (
                      <div key={index} className="flex gap-4 border-b border-white/5 pb-4 last:border-0 last:pb-0">
                        <div className="w-16 h-20 bg-white/5 rounded-none border border-white/10 overflow-hidden flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col flex-1 py-0.5 justify-between">
                          <div className="flex justify-between items-start gap-4">
                            <span className="font-cormorant font-semibold text-[17px] text-white/90 leading-tight line-clamp-2">{item.name}</span>
                            <span className="font-montserrat text-[13px] font-semibold text-white/95 whitespace-nowrap">₹{item.price * item.quantity}</span>
                          </div>
                          <div className="flex justify-between items-center text-[10px] text-white/50 font-montserrat">
                            <span>Standard ({item.size})</span>
                            <span>Qty: {item.quantity}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary Totals */}
                  <div className="space-y-4 font-montserrat text-[12px] text-white/80 border-t border-[#c9a96e]/20 mt-6 pt-6">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-white/60">Subtotal</span>
                      <span className="font-semibold text-white">₹{totalPrice}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-white/60">Shipping</span>
                      <span className="text-[#c9a96e] font-semibold uppercase text-xs tracking-wider">Free</span>
                    </div>
                    <div className="flex justify-between items-end pt-4 border-t border-white/10 mt-2">
                      <span className="text-[14px] font-bold text-white/90 uppercase tracking-wider">Total</span>
                      <span className="text-[24px] font-bold text-[#c9a96e]">₹{totalPrice}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
