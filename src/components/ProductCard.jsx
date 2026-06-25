import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/cartSlice'

export default function ProductCard({ product, className = '', isShopPage = false }) {
  const [hovered, setHovered] = useState(false)
  const [wished, setWished] = useState(false)
  const [added, setAdded] = useState(false)
  const dispatch = useDispatch()

  const handlePreBook = () => {
    if (added) return
    
    // Convert string price like '₹4,800' to a number 4800
    const rawPrice = typeof product.price === 'string' 
      ? Number(product.price.replace(/[^0-9.-]+/g, '')) 
      : product.price;

    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: rawPrice || 0,
      image: product.imgPrimary || product.image,
      size: '50ml',
      quantity: 1
    }))
    
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div
      className={`flex flex-col bg-white cursor-pointer overflow-hidden transition-all duration-[380ms] ${hovered ? 'product-card-hover-shadow' : ''} ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <Link to={`/product/${product.id}`} className="relative w-full overflow-hidden product-img-bg block" style={{ aspectRatio: '3/4' }}>
        <img
          className="absolute inset-0 w-full h-full object-cover object-top transition-all duration-[550ms]"
          src={product.imgPrimary}
          alt={product.name}
          style={{ opacity: hovered ? 0 : 1, transform: hovered ? 'scale(1.04)' : 'scale(1)' }}
        />
        <img
          className="absolute inset-0 w-full h-full object-cover object-top transition-all duration-[650ms]"
          src={product.imgHover}
          alt={`${product.name} hover`}
          style={{ opacity: hovered ? 1 : 0, transform: hovered ? 'scale(1)' : 'scale(1.06)' }}
        />
        <button
          className={`absolute top-3 right-3 z-[4] w-[30px] h-[30px] rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 card-wishlist-btn ${hovered ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.8]'}`}
          aria-label="Wishlist"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setWished(!wished)
          }}
        >
          <i className={`${wished ? 'fa-solid' : 'fa-regular'} fa-heart text-[12px] transition-colors`}
            style={{ color: wished ? '#b34a4a' : '#1a1410' }} />
        </button>
      </Link>

      {/* Body */}
      <div className="card-body-divider card-body-bg relative px-[18px] pt-[18px] pb-[20px] grid gap-x-3 flex-1">
        <Link to={`/product/${product.id}`} style={{ gridArea: 'name' }} className="mb-[13px] block">
          {isShopPage && (
            <div className="flex gap-[2px] text-[#c9a96e] text-[9px] mb-[6px]">
              <i className="fa-solid fa-star" />
              <i className="fa-solid fa-star" />
              <i className="fa-solid fa-star" />
              <i className="fa-solid fa-star" />
              <i className="fa-solid fa-star" />
            </div>
          )}
          <h3 className="font-cormorant text-[21px] font-medium tracking-[.05em] text-[#0f0d0b] leading-[1.05]">
            {product.name}
          </h3>
          {isShopPage && (
            <p className="font-montserrat text-[10px] text-[#0f0d0b]/70 leading-[1.5] mt-[8px] line-clamp-2">
              {product.desc}
            </p>
          )}
        </Link>
        <div style={{ gridArea: 'price' }}>
          <span className="font-cormorant text-[24px] font-medium tracking-[.03em] text-[#0f0d0b] leading-none">
            {product.price}
          </span>
        </div>
        <button
          className={`inline-flex items-center gap-[6px] font-montserrat text-[9px] font-medium tracking-[.16em] uppercase text-white px-[14px] py-[9px] cursor-pointer transition-all hover:scale-[.97] flex-shrink-0 ${added ? 'btn-cart-added' : 'btn-cart-bg'}`}
          style={{ gridArea: 'cart' }}
          onClick={(e) => {
            e.stopPropagation()
            handlePreBook()
          }}
        >
          <i className={`fa-solid ${added ? 'fa-check' : 'fa-bag-shopping'}`} />
          <span className="max-[640px]:hidden">{added ? 'Pre-booked' : 'Pre-book'}</span>
        </button>
      </div>
    </div>
  )
}
