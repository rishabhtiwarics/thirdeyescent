import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { updateQuantity, removeFromCart } from '../../store/cartSlice'

export default function CartItem({ item, isMini = false, onCloseMini = null }) {
  const dispatch = useDispatch()

  const handleLinkClick = () => {
    if (onCloseMini) onCloseMini()
  }

  // Mini Cart representation
  if (isMini) {
    return (
      <div className="flex gap-4 pb-6 mb-6 border-b border-white/10 last:border-0 last:mb-0 last:pb-0">
        {/* Product Image */}
        <Link 
          to={`/product/${item.id}`} 
          onClick={handleLinkClick}
          className="w-20 h-24 bg-white/5 backdrop-blur-sm border border-white/10 rounded-sm overflow-hidden flex-shrink-0"
        >
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        </Link>
        
        {/* Details */}
        <div className="flex flex-col flex-1 py-1">
          <div className="flex justify-between items-start gap-4">
            <Link 
              to={`/product/${item.id}`} 
              onClick={handleLinkClick}
              className="font-cormorant font-semibold hover:text-[#c9a96e] transition-colors line-clamp-2 text-[18px] text-white/90"
            >
              {item.name}
            </Link>
            <p className="font-montserrat font-semibold text-[14px] text-white">
              ₹{item.price * item.quantity}
            </p>
          </div>

          <p className="font-montserrat font-medium text-[10px] mt-1 text-white/50">
            Standard ({item.size})
          </p>

          <div className="mt-auto flex items-center justify-between">
            {/* Quantity Controls */}
            <div className="flex items-center border border-white/20 bg-white/5 backdrop-blur-sm rounded-sm overflow-hidden h-8 w-24">
              <button 
                onClick={() => dispatch(updateQuantity({ id: item.id, size: item.size, quantity: Math.max(1, item.quantity - 1) }))}
                className="w-8 text-white/50 hover:text-white hover:bg-white/10 h-full flex items-center justify-center transition"
              >
                <i className="fa-solid fa-minus text-[10px]" />
              </button>
              <span className="flex-1 text-center font-montserrat font-medium text-[11px] text-white/90">
                {item.quantity}
              </span>
              <button 
                onClick={() => dispatch(updateQuantity({ id: item.id, size: item.size, quantity: item.quantity + 1 }))}
                className="w-8 text-white/50 hover:text-white hover:bg-white/10 h-full flex items-center justify-center transition"
              >
                <i className="fa-solid fa-plus text-[10px]" />
              </button>
            </div>

            {/* Remove */}
            <button 
              onClick={() => dispatch(removeFromCart({ id: item.id, size: item.size }))}
              className="text-white/40 hover:text-[#c9a96e] transition-colors ml-4 p-2"
              aria-label="Remove item"
            >
              <i className="fa-solid fa-xmark text-[14px] text-white/50" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Main Cart Page representation (matches Figma UI)
  return (
    <>
      {/* Desktop view: 12-column grid */}
      <div className="hidden md:grid grid-cols-12 items-center gap-4 py-5 px-6 bg-white border border-[#1a1410]/5 shadow-[0_4px_20px_rgba(26,20,16,0.06)] rounded-none">
        {/* Column 1: Delete Button */}
        <div className="col-span-1 flex justify-center">
          <button 
            onClick={() => dispatch(removeFromCart({ id: item.id, size: item.size }))}
            className="text-[#1a1410]/40 hover:text-red-600 hover:scale-115 transition-all duration-300 p-2 text-lg flex items-center justify-center"
            aria-label="Remove item"
          >
            <i className="fa-regular fa-trash-can" />
          </button>
        </div>

        {/* Column 2 to 12: Grid layout container to align with yellow/gold header */}
        <div className="col-span-11 grid grid-cols-12 gap-4 items-center px-6">
          {/* Product (Image & details) */}
          <div className="col-span-6 flex items-center gap-5">
            <Link 
              to={`/product/${item.id}`}
              className="w-28 h-28 md:w-32 md:h-32 bg-[#f2ede6] flex items-center justify-center rounded-none border border-[#1a1410]/5 overflow-hidden flex-shrink-0"
            >
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </Link>
            <div>
              <Link 
                to={`/product/${item.id}`}
                className="font-montserrat font-bold text-[14px] text-[#1a1410] hover:text-[#c9a96e] transition-colors leading-tight"
              >
                {item.name}
              </Link>
              <p className="font-montserrat text-[11px] text-[#1a1410]/50 mt-1.5 font-medium">
                Standard ({item.size})
              </p>
            </div>
          </div>

          {/* Price */}
          <div className="col-span-2 text-center font-montserrat text-[15px] text-[#1a1410]/80 font-medium">
            ₹{item.price}
          </div>

          {/* Quantity */}
          <div className="col-span-2 flex justify-center">
            <div className="flex items-center border border-[#1a1410]/15 rounded-none overflow-hidden bg-white h-9">
              <button 
                onClick={() => dispatch(updateQuantity({ id: item.id, size: item.size, quantity: Math.max(1, item.quantity - 1) }))}
                className="px-3 text-[#1a1410]/40 hover:text-[#1a1410] hover:bg-[#fffaf4] transition-colors font-light text-base h-full flex items-center justify-center"
              >
                -
              </button>
              <span className="w-8 text-center font-montserrat text-xs font-semibold text-[#1a1410] border-x border-[#1a1410]/15 h-full flex items-center justify-center">
                {item.quantity}
              </span>
              <button 
                onClick={() => dispatch(updateQuantity({ id: item.id, size: item.size, quantity: item.quantity + 1 }))}
                className="px-3 text-[#1a1410]/40 hover:text-[#1a1410] hover:bg-[#fffaf4] transition-colors font-light text-base h-full flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          {/* Subtotal */}
          <div className="col-span-2 text-right font-montserrat text-[15px] text-[#1a1410] font-semibold">
            ₹{item.price * item.quantity}
          </div>
        </div>
      </div>

      {/* Mobile view: Stacked representation */}
      <div className="flex md:hidden gap-4 p-4 bg-white border border-[#1a1410]/5 shadow-[0_4px_20px_rgba(26,20,16,0.06)] rounded-none relative">
        {/* Remove button at top-right */}
        <button 
          onClick={() => dispatch(removeFromCart({ id: item.id, size: item.size }))}
          className="absolute top-4 right-2 text-[#1a1410]/40 hover:text-red-600 transition-colors p-1.5 flex items-center justify-center"
          aria-label="Remove item"
        >
          <i className="fa-regular fa-trash-can text-sm" />
        </button>

        {/* Product Image */}
        <Link 
          to={`/product/${item.id}`} 
          className="w-24 h-24 sm:w-28 sm:h-28 bg-[#f2ede6] flex items-center justify-center rounded-none border border-[#1a1410]/5 overflow-hidden flex-shrink-0"
        >
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        </Link>

        {/* Details */}
        <div className="flex flex-col flex-1 pr-6 justify-between">
          <div>
            <Link 
              to={`/product/${item.id}`}
              className="font-montserrat font-bold text-[13px] text-[#1a1410] hover:text-[#c9a96e] transition-colors leading-tight block mb-0.5"
            >
              {item.name}
            </Link>
            <p className="font-montserrat text-[10px] text-[#1a1410]/50 font-medium">Standard ({item.size})</p>
          </div>

          <div className="flex justify-between items-center mt-2.5">
            {/* Quantity Selector */}
            <div className="flex items-center border border-[#1a1410]/15 rounded-none overflow-hidden bg-white h-7">
              <button 
                onClick={() => dispatch(updateQuantity({ id: item.id, size: item.size, quantity: Math.max(1, item.quantity - 1) }))}
                className="px-2 text-[#1a1410]/40 hover:text-[#1a1410] transition-colors font-light text-sm"
              >
                -
              </button>
              <span className="w-6 text-center font-montserrat text-[10px] font-semibold text-[#1a1410] border-x border-[#1a1410]/15">
                {item.quantity}
              </span>
              <button 
                onClick={() => dispatch(updateQuantity({ id: item.id, size: item.size, quantity: item.quantity + 1 }))}
                className="px-2 text-[#1a1410]/40 hover:text-[#1a1410] transition-colors font-light text-sm"
              >
                +
              </button>
            </div>

            {/* Subtotal */}
            <div className="font-montserrat text-[12px] text-[#1a1410] font-semibold">
              ₹{item.price * item.quantity}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
