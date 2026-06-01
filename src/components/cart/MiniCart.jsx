import React from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import CartItem from './CartItem'

export default function MiniCart({ isOpen, onClose }) {
  const { items, totalPrice } = useSelector(state => state.cart)
  const navigate = useNavigate()

  const handleCheckout = () => {
    onClose()
    navigate('/checkout')
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-[#1a1410]/40 backdrop-blur-sm z-[200] transition-opacity duration-400 ease-in-out ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-4 right-4 bottom-4 w-[calc(100%-32px)] sm:w-full max-w-[420px] z-[210] shadow-2xl flex flex-col transition-transform duration-500 overflow-hidden ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'translate-x-0' : 'translate-x-[120%]'}`}
        style={{
          background: 'linear-gradient(160deg, #0f0d0b 0%, #1a1510 40%, #0a0807 100%)',
          border: '1px solid rgba(201,169,110,0.15)'
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-8 py-6 flex-shrink-0"
          style={{ background: 'linear-gradient(120deg, rgba(61,42,16,.70) 0%, rgba(105,74,32,.45) 40%, rgba(45,30,10,.65) 70%, rgba(20,14,6,.50) 100%)' }}
        >
          <h2 className="font-montserrat font-semibold text-[16px] text-white flex items-center gap-2 m-0">
            Bag
            <span className="bg-[#c9a96e] text-white text-[10px] rounded-sm px-2 py-0.5 leading-tight">
              {items.length}
            </span>
          </h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors p-2"
          >
            <i className="fa-solid fa-xmark text-[18px]" />
          </button>
        </div>

        {/* Body / Items */}
        <div
          className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar"
          style={{
            backgroundColor: '#0a0807',
            backgroundImage: 'linear-gradient(180deg, rgba(15,13,11,0.65) 0%, rgba(10,8,7,0.85) 100%), url("/img/newsection/three.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <i className="fa-solid fa-bag-shopping text-[40px] text-white/10 mb-4" />
              <p className="font-cormorant text-[24px] text-white/80 mb-2">Your bag is empty</p>
              <button
                onClick={onClose}
                className="font-montserrat text-[10px] tracking-[.2em] uppercase text-[#c9a96e] border-b border-[#c9a96e]/30 pb-1 hover:text-white hover:border-white transition-colors mt-4"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="flex flex-col">
              {items.map((item, index) => (
                <CartItem
                  key={`${item.id}-${item.size}-${index}`}
                  item={item}
                  isMini={true}
                  onCloseMini={onClose}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div
            className="border-t border-[#c9a96e]/10 px-8 py-4 flex-shrink-0"
            style={{ background: 'linear-gradient(120deg, rgba(61,42,16,.70) 0%, rgba(105,74,32,.45) 40%, rgba(45,30,10,.65) 70%, rgba(20,14,6,.50) 100%)' }}
          >
            <div className="flex flex-col gap-2">
              <button
                onClick={handleCheckout}
                className="w-full bg-[#c9a96e] hover:bg-white text-[#1a1410] font-montserrat text-[10px] font-bold tracking-[.15em] py-2.5 rounded-none transition-colors uppercase flex items-center justify-center gap-2"
              >
                Checkout
                <i className="fa-solid fa-arrow-right text-[9px]" />
              </button>
              
              <button
                onClick={() => {
                  onClose()
                  navigate('/cart')
                }}
                className="w-full bg-transparent hover:bg-white/10 text-white border border-white/20 font-montserrat text-[10px] font-bold tracking-[.15em] py-2.5 rounded-none transition-all uppercase flex items-center justify-center gap-2"
              >
                View Cart
                <i className="fa-solid fa-bag-shopping text-[9px]" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
