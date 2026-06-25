import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Swiper from 'swiper'
import { Autoplay, Navigation } from 'swiper/modules'

const galleryImages = [
  { src: '/img/prefallimg/one.png', alt: 'Look 1' },
  { src: '/img/prefallimg/two.png', alt: 'Look 2' },
  { src: '/img/prefallimg/three.png', alt: 'Look 3' },
  { src: '/img/prefallimg/four.png', alt: 'Look 4' },
  { src: '/img/prefallimg/five.png', alt: 'Look 5' },
  { src: '/img/prefallimg/six.png', alt: 'Look 6' },
  { src: '/img/prefallimg/seven.png', alt: 'Look 7' },
  { src: '/img/prefallimg/eight.png', alt: 'Look 8' },
]

export default function GalleryStrip() {
  const swiperRef = useRef(null)
  const prevRef = useRef(null)
  const nextRef = useRef(null)

  useEffect(() => {
    const swiper = new Swiper(swiperRef.current, {
      modules: [Autoplay, Navigation],
      slidesPerView: 'auto',
      spaceBetween: 4,
      loop: true,
      speed: 700,
      autoplay: { delay: 3200, disableOnInteraction: false },
      navigation: {
        nextEl: nextRef.current,
        prevEl: prevRef.current,
      },
    })
    return () => swiper.destroy(true, true)
  }, [])

  return (
    <section id="gallery-strip" className="pt-12 overflow-hidden relative">
      <div className="px-10 mb-6 text-center">
        <p className="font-montserrat text-[10px] tracking-[.40em] uppercase mb-[6px] gallery-label-color">The Edit</p>
        <h2 className="font-cormorant font-light tracking-[.05em] text-[#1a1410] gallery-title">Pre-Fall 2026 — Campaign</h2>
      </div>

      <div className="gallery-nav relative w-full">
        <div ref={swiperRef} className="swiper gallery-swiper-el w-full overflow-hidden">
          <div className="swiper-wrapper">
            {galleryImages.map((img, i) => (
              <div key={i} className="swiper-slide group relative overflow-hidden cursor-pointer">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover object-top block transition-transform duration-[800ms] group-hover:scale-[1.05] gallery-slide-img"
                />
                <Link
                  to="/shop"
                  className="absolute inset-[10px] z-[3] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-[380ms] scale-[.12] group-hover:scale-100 no-underline gallery-shop-overlay"
                >
                  <span className="inline-flex items-center justify-center font-montserrat text-[10px] font-medium tracking-[.22em] uppercase text-white px-[18px] py-[11px] min-w-[118px] min-h-[38px] transition-all hover:-translate-y-px gallery-shop-btn-inner">
                    Shop Now
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Nav Buttons */}
        <div ref={prevRef} className="swiper-button-prev" />
        <div ref={nextRef} className="swiper-button-next" />
      </div>
    </section>
  )
}
