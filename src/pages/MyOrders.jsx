import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { orderAPI } from '../services/api'

export default function MyOrders() {
  const { isAuthenticated, user } = useSelector(state => state.auth)
  const navigate = useNavigate()

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [heroVisible, setHeroVisible] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null) // for order details modal
  const heroRef = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const timer = setTimeout(() => setHeroVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const fetchOrders = async () => {
    if (!isAuthenticated) {
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      const res = await orderAPI.getMyOrders()
      // The API returns { count: number, data: order[] }
      if (res && res.data) {
        setOrders(res.data)
      } else if (Array.isArray(res)) {
        setOrders(res)
      } else {
        setOrders([])
      }
      setError('')
    } catch (err) {
      setError(err.message || 'Failed to fetch your orders. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [isAuthenticated])

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      try {
        setLoading(true)
        await orderAPI.cancelOrder(orderId)
        alert('Order has been successfully cancelled.')
        fetchOrders() // refresh orders list
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(null) // close details modal if open
        }
      } catch (err) {
        alert(err.message || 'Failed to cancel the order. Please try again.')
        setLoading(false)
      }
    }
  }

  // Helpers for formatting
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Get status color styling
  const getStatusStyle = (status) => {
    const s = (status || '').toLowerCase()
    switch (s) {
      case 'delivered':
        return {
          bg: 'bg-emerald-500/10',
          text: 'text-emerald-600',
          border: 'border-emerald-500/20',
          label: 'Delivered'
        }
      case 'shipped':
        return {
          bg: 'bg-blue-500/10',
          text: 'text-blue-600',
          border: 'border-blue-500/20',
          label: 'Shipped'
        }
      case 'processing':
      case 'confirmed':
        return {
          bg: 'bg-amber-500/10',
          text: 'text-amber-600',
          border: 'border-amber-500/20',
          label: 'Processing'
        }
      case 'pending':
        return {
          bg: 'bg-[#c9a96e]/10',
          text: 'text-[#c9a96e]',
          border: 'border-[#c9a96e]/20',
          label: 'Pending'
        }
      case 'cancelled':
        return {
          bg: 'bg-rose-500/10',
          text: 'text-rose-600',
          border: 'border-rose-500/20',
          label: 'Cancelled'
        }
      default:
        return {
          bg: 'bg-zinc-500/10',
          text: 'text-zinc-600',
          border: 'border-zinc-500/20',
          label: status
        }
    }
  }

  const getPaymentStatusStyle = (paymentStatus) => {
    const s = (paymentStatus || '').toLowerCase()
    if (s === 'paid' || s === 'success') {
      return 'text-emerald-600 border-emerald-500/20 bg-emerald-500/5'
    }
    return 'text-amber-600 border-[#c9a96e]/20 bg-[#c9a96e]/5'
  }

  return (
    <>
      {/* ══ HERO SECTION ══ */}
      <section
        ref={heroRef}
        className="relative w-full overflow-hidden shop-hero-section"
      >
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/img/hero/shopbnr2.png"
            alt="My Orders Background"
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
                My Orders
              </h1>
            </nav>
          </div>
        </div>
      </section>

      {/* ══ CONTENT AREA ══ */}
      <div className="bg-white py-[72px] w-full min-h-[50vh] relative">
        <div className="w-full max-w-[1320px] mx-auto px-4 md:px-8">

          {/* Heading */}
          <div className="flex justify-between items-baseline border-b border-[#1a1410]/10 pb-4 mb-8">
            <h2 className="font-cormorant text-[36px] font-semibold text-[#1a1410]">
              My Orders
            </h2>
            <Link 
              to="/shop"
              className="font-montserrat text-[11px] font-semibold tracking-[.2em] uppercase text-[#1a1410] hover:text-[#c9a96e] transition-all flex items-center gap-2"
            >
              <i className="fa-solid fa-arrow-left-long text-[10px]" /> Continue Shopping
            </Link>
          </div>

          {/* LOADING STATE */}
          {loading && (
            <div className="py-24 flex flex-col items-center justify-center">
              <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 rounded-none border-[3px] border-[#c9a96e]/20" />
                <div className="absolute inset-0 rounded-none border-[3px] border-t-[#c9a96e] animate-spin" />
              </div>
              <p className="font-montserrat text-xs text-[#1a1410]/50 tracking-wider">Retrieving your orders...</p>
            </div>
          )}

          {/* ERROR STATE */}
          {!loading && error && (
            <div className="text-center py-16 px-8 max-w-xl mx-auto border border-rose-500/10 bg-rose-500/5 text-[#1a1410]">
              <i className="fa-solid fa-triangle-exclamation text-3xl text-rose-500 mb-4" />
              <h3 className="font-cormorant text-2xl font-semibold mb-2">Something went wrong</h3>
              <p className="font-montserrat text-xs text-[#1a1410]/70 mb-6">{error}</p>
              <button 
                onClick={fetchOrders}
                className="bg-[#1a1410] hover:bg-[#c9a96e] text-white hover:text-[#1a1410] font-montserrat text-[11px] font-bold tracking-[.2em] uppercase px-8 py-3 transition-colors duration-300"
              >
                Try Again
              </button>
            </div>
          )}

          {/* AUTH GUARD */}
          {!loading && !error && !isAuthenticated && (
            <div className="text-center py-20 px-8 bg-white border border-[#1a1410]/5 shadow-[0_4px_30px_rgba(26,20,16,0.06)] rounded-none max-w-xl mx-auto flex flex-col items-center">
              <div className="w-20 h-20 rounded-none bg-[#fffaf4] border border-[#c9a96e]/20 flex items-center justify-center mb-6 shadow-sm">
                <i className="fa-solid fa-user-lock text-3xl text-[#c9a96e]" />
              </div>
              <h2 className="font-cormorant text-[32px] font-semibold text-[#1a1410] mb-3">
                Sign In Required
              </h2>
              <p className="font-montserrat text-[12px] text-[#1a1410]/50 tracking-wider mb-8 max-w-sm leading-relaxed">
                To view and track your orders, please sign in to your sanctuary account.
              </p>
              <Link
                to="/login"
                className="bg-[#1a1410] hover:bg-[#c9a96e] text-white hover:text-[#1a1410] font-montserrat text-[11px] font-bold tracking-[.2em] uppercase px-10 py-4 border border-[#1a1410] hover:border-[#c9a96e] transition-all duration-300 rounded-none"
              >
                Sign In
              </Link>
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && !error && isAuthenticated && orders.length === 0 && (
            <div className="text-center py-20 px-8 bg-white border border-[#1a1410]/5 shadow-[0_4px_30px_rgba(26,20,16,0.06)] rounded-none max-w-xl mx-auto flex flex-col items-center">
              <div className="w-20 h-20 bg-[#fffaf4] border border-[#c9a96e]/20 flex items-center justify-center mb-6 shadow-sm">
                <i className="fa-solid fa-box-open text-3xl text-[#c9a96e]" />
              </div>
              <h2 className="font-cormorant text-[32px] font-semibold text-[#1a1410] mb-3">
                No Orders Yet
              </h2>
              <p className="font-montserrat text-[12px] text-[#1a1410]/50 tracking-wider mb-8 max-w-sm leading-relaxed">
                You haven't placed any orders yet. Discover our premium extrait, oud, musk and amber perfume notes in our collection.
              </p>
              <Link
                to="/shop"
                className="group inline-flex items-center justify-center gap-2.5 bg-[#1a1410] hover:bg-[#c9a96e] text-white hover:text-[#1a1410] font-montserrat text-[11px] font-bold tracking-[.2em] uppercase px-10 py-4 border border-[#1a1410] hover:border-[#c9a96e] transition-all duration-300 rounded-none shadow-[0_4px_15px_rgba(26,20,16,0.15)]"
              >
                Discover Creations
                <i className="fa-solid fa-arrow-right text-[10px] transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          )}

          {/* ORDERS LIST */}
          {!loading && !error && isAuthenticated && orders.length > 0 && (
            <div className="space-y-8">
              {orders.map((order) => {
                const statusStyle = getStatusStyle(order.orderStatus)
                return (
                  <div 
                    key={order._id || order.id}
                    className="border border-[#1a1410]/10 hover:border-[#c9a96e]/30 transition-all duration-300 rounded-none bg-[#fffaf4]/5 overflow-hidden shadow-sm"
                  >
                    {/* Card Header (aligned layout & theme) */}
                    <div 
                      className="px-6 py-4 border-b border-[#1a1410]/10 flex flex-wrap gap-y-4 items-center justify-between relative"
                      style={{ background: 'linear-gradient(135deg, rgba(61,42,16,.03) 0%, rgba(105,74,32,.01) 40%, rgba(20,14,6,.04) 100%)' }}
                    >
                      <div className="flex flex-wrap gap-x-6 gap-y-2">
                        <div>
                          <span className="block font-montserrat text-[9px] uppercase tracking-wider text-[#1a1410]/40">Order Date</span>
                          <span className="font-montserrat text-xs font-semibold text-[#1a1410]">{formatDate(order.createdAt)}</span>
                        </div>
                        <div>
                          <span className="block font-montserrat text-[9px] uppercase tracking-wider text-[#1a1410]/40">Order ID</span>
                          <span className="font-montserrat text-xs font-semibold text-[#1a1410]">{order._id || order.id}</span>
                        </div>
                        <div>
                          <span className="block font-montserrat text-[9px] uppercase tracking-wider text-[#1a1410]/40">Payment Status</span>
                          <span className={`inline-block border px-2 py-0.5 font-montserrat text-[10px] tracking-wider font-semibold uppercase ${getPaymentStatusStyle(order.paymentStatus)}`}>
                            {order.paymentStatus || 'Pending'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`border px-3 py-1 font-montserrat text-[10px] tracking-widest font-bold uppercase ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                          {statusStyle.label}
                        </span>
                      </div>
                    </div>

                    {/* Card Body - Products List */}
                    <div className="p-6">
                      <div className="divide-y divide-[#1a1410]/5">
                        {(order.items || []).map((item, idx) => (
                          <div key={idx} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                            <div className="w-16 h-20 bg-[#fffaf4]/20 border border-[#1a1410]/5 overflow-hidden flex-shrink-0">
                              <img src={item.image || '/img/product/placeholder.png'} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 flex flex-col md:flex-row justify-between py-1">
                              <div className="space-y-1">
                                <h4 className="font-cormorant font-bold text-lg text-[#1a1410] leading-snug">{item.name}</h4>
                                <div className="flex items-center gap-4 text-[10px] text-[#1a1410]/55 font-montserrat">
                                  <span>Quantity: {item.quantity}</span>
                                  <span>|</span>
                                  <span>Standard Size</span>
                                </div>
                              </div>
                              <div className="mt-2 md:mt-0 text-right flex md:flex-col justify-between md:justify-start items-baseline md:items-end">
                                <span className="font-montserrat text-xs text-[#1a1410]/50 md:hidden">Price:</span>
                                <span className="font-montserrat text-sm font-semibold text-[#1a1410]">₹{(item.price || 0) * (item.quantity || 1)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="px-6 py-4 bg-[#fffaf4]/20 border-t border-[#1a1410]/5 flex justify-between items-center flex-wrap gap-4">
                      <div>
                        <span className="font-montserrat text-xs text-[#1a1410]/50 mr-2">Total Amount:</span>
                        <span className="font-montserrat text-lg font-bold text-[#c9a96e]">₹{order.totalAmount || order.subTotal || 0}</span>
                      </div>
                      
                      <div className="flex gap-3">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="bg-transparent hover:bg-[#1a1410]/5 text-[#1a1410] border border-[#1a1410]/20 font-montserrat text-[10px] font-bold tracking-[.15em] uppercase px-5 py-2.5 transition-colors duration-200 cursor-pointer"
                        >
                          View Details
                        </button>
                        
                        {/* Cancel button: Visible only if orderStatus is pending or processing */}
                        {['pending', 'processing'].includes((order.orderStatus || '').toLowerCase()) && (
                          <button
                            onClick={() => handleCancelOrder(order._id || order.id)}
                            className="bg-transparent hover:bg-rose-600/10 text-rose-600 border border-rose-500/20 font-montserrat text-[10px] font-bold tracking-[.15em] uppercase px-5 py-2.5 transition-colors duration-200 cursor-pointer"
                          >
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ══ ORDER DETAILS MODAL ══ */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            onClick={() => setSelectedOrder(null)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          />

          {/* Modal Container */}
          <div className="relative bg-white w-full max-w-2xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div 
              className="px-6 py-4 flex items-center justify-between border-b border-[#c9a96e]/20 text-white relative"
              style={{ background: 'linear-gradient(120deg, rgba(61,42,16,.95) 0%, rgba(105,74,32,.90) 40%, rgba(45,30,10,.95) 100%)' }}
            >
              <div>
                <h3 className="font-montserrat font-bold text-[14px] tracking-wider uppercase m-0">Order Specifications</h3>
                <span className="font-montserrat text-[10px] text-[#c9a96e] tracking-wider mt-0.5 block">ID: {selectedOrder._id || selectedOrder.id}</span>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="bg-transparent border-none text-white hover:text-[#c9a96e] transition-colors cursor-pointer text-lg p-1"
                aria-label="Close details"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            {/* Modal Content (scrollable) */}
            <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar text-[#1a1410]">
              
              {/* Status and Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-[#1a1410]/10 p-4 bg-[#fffaf4]/20">
                  <h4 className="font-montserrat text-[9px] uppercase tracking-wider text-[#1a1410]/55 font-bold mb-2">Order Information</h4>
                  <p className="font-montserrat text-xs font-semibold mb-1">Date: {formatDate(selectedOrder.createdAt)}</p>
                  <p className="font-montserrat text-xs font-semibold mb-1">Payment Method: <span className="uppercase text-[10px]">{selectedOrder.paymentMethod || 'COD'}</span></p>
                  <p className="font-montserrat text-xs font-semibold">Payment Status: <span className="uppercase text-[10px]">{selectedOrder.paymentStatus || 'Pending'}</span></p>
                </div>
                <div className="border border-[#1a1410]/10 p-4 bg-[#fffaf4]/20">
                  <h4 className="font-montserrat text-[9px] uppercase tracking-wider text-[#1a1410]/55 font-bold mb-2">Order Status</h4>
                  <div className="flex items-center gap-2">
                    <span className={`inline-block border px-2.5 py-0.5 font-montserrat text-[10px] tracking-wider font-bold uppercase ${getStatusStyle(selectedOrder.orderStatus).bg} ${getStatusStyle(selectedOrder.orderStatus).text} ${getStatusStyle(selectedOrder.orderStatus).border}`}>
                      {getStatusStyle(selectedOrder.orderStatus).label}
                    </span>
                  </div>
                  {selectedOrder.deliveredAt && (
                    <p className="font-montserrat text-[11px] text-[#1a1410]/60 mt-2">Delivered on: {formatDate(selectedOrder.deliveredAt)}</p>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="border border-[#1a1410]/10 p-5 bg-[#fffaf4]/10">
                <h4 className="font-montserrat text-[9px] uppercase tracking-wider text-[#1a1410]/55 font-bold mb-3 border-b border-[#1a1410]/5 pb-1">Shipping Details</h4>
                <div className="font-montserrat text-xs space-y-1">
                  <p className="font-semibold text-sm">{selectedOrder.shippingAddress?.name || user?.name}</p>
                  <p className="text-[#1a1410]/70">{selectedOrder.shippingAddress?.addressLine1 || selectedOrder.shippingAddress?.line1}</p>
                  {selectedOrder.shippingAddress?.addressLine2 && (
                    <p className="text-[#1a1410]/70">{selectedOrder.shippingAddress?.addressLine2}</p>
                  )}
                  <p className="text-[#1a1410]/70">
                    {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pinCode || selectedOrder.shippingAddress?.pincode}
                  </p>
                  <p className="text-[#1a1410]/70">{selectedOrder.shippingAddress?.country || 'India'}</p>
                  {selectedOrder.shippingAddress?.email && (
                    <p className="text-[#1a1410]/70 mt-2"><i className="fa-regular fa-envelope mr-1.5" />{selectedOrder.shippingAddress.email}</p>
                  )}
                  {selectedOrder.shippingAddress?.phone && (
                    <p className="text-[#1a1410]/70"><i className="fa-solid fa-phone mr-1.5" />{selectedOrder.shippingAddress.phone}</p>
                  )}
                </div>
              </div>

              {/* Itemized breakdown */}
              <div>
                <h4 className="font-montserrat text-[9px] uppercase tracking-wider text-[#1a1410]/55 font-bold mb-3">Itemized Spec</h4>
                <div className="border border-[#1a1410]/10 divide-y divide-[#1a1410]/10">
                  {(selectedOrder.items || []).map((item, idx) => (
                    <div key={idx} className="flex gap-4 p-4 items-center">
                      <div className="w-12 h-16 bg-[#fffaf4]/20 border border-[#1a1410]/5 overflow-hidden flex-shrink-0">
                        <img src={item.image || '/img/product/placeholder.png'} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex justify-between items-center py-1">
                        <div>
                          <h5 className="font-cormorant font-bold text-[16px] leading-snug">{item.name}</h5>
                          <span className="font-montserrat text-[10px] text-[#1a1410]/55 block">Standard Size | Qty: {item.quantity}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-montserrat text-sm font-semibold">₹{(item.price || 0) * (item.quantity || 1)}</span>
                          <span className="block font-montserrat text-[9px] text-[#1a1410]/40">₹{item.price} each</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Totals */}
              <div className="border-t border-[#1a1410]/10 pt-4 font-montserrat text-xs space-y-2 max-w-sm ml-auto">
                <div className="flex justify-between">
                  <span className="text-[#1a1410]/60">Subtotal:</span>
                  <span className="font-semibold">₹{selectedOrder.subTotal || (selectedOrder.totalAmount - (selectedOrder.shippingCharge || 0)) || selectedOrder.totalPrice || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#1a1410]/60">Shipping:</span>
                  <span className="text-emerald-600 font-semibold uppercase text-[10px]">Free</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-[#c9a96e]">
                    <span>Discount:</span>
                    <span className="font-semibold">-₹{selectedOrder.discount}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-[#1a1410]/10 pt-2 items-end">
                  <span className="font-bold text-sm">Total:</span>
                  <span className="font-bold text-lg text-[#c9a96e]">₹{selectedOrder.totalAmount || selectedOrder.subTotal || 0}</span>
                </div>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="px-6 py-4 bg-[#fffaf4]/20 border-t border-[#1a1410]/10 flex justify-end gap-3">
              {['pending', 'processing'].includes((selectedOrder.orderStatus || '').toLowerCase()) && (
                <button
                  onClick={() => handleCancelOrder(selectedOrder._id || selectedOrder.id)}
                  className="bg-transparent hover:bg-rose-600/10 text-rose-600 border border-rose-500/20 font-montserrat text-[10px] font-bold tracking-[.15em] uppercase px-6 py-3 transition-colors duration-200 cursor-pointer"
                >
                  Cancel Order
                </button>
              )}
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-[#1a1410] hover:bg-[#c9a96e] text-white hover:text-[#1a1410] font-montserrat text-[10px] font-bold tracking-[.15em] uppercase px-6 py-3 transition-colors duration-200 cursor-pointer"
              >
                Close Specifications
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}
