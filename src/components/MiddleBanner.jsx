import React from 'react'

export default function MiddleBanner() {
  return (
    <section
      id="middle-banner"
      className="relative w-full flex items-center py-[90px] overflow-hidden"
      aria-label="Third Eye Scent Banner"
    >
      {/* Overlay */}
      <div className="absolute inset-0 z-[1] banner-overlay" />

      <div className="relative z-[2] max-w-[1320px] mx-auto px-6 w-full">
        <div className="flex flex-wrap items-center justify-between gap-10">

          {/* Images column — 60% */}
          <div className="flex-[0_0_calc(60%-20px)] max-w-[calc(60%-20px)] max-[991px]:flex-[0_0_100%] max-[991px]:max-w-full">
            <div className="w-full flex justify-center">
              <div className="relative w-full overflow-hidden transition-all duration-[600ms] cursor-pointer group banner-img-wrap">
                <img
                  src="/img/hero/overlayimg.png"
                  alt="Perfume Essence"
                  className="w-full h-full object-cover block animate-breath"
                />
              </div>
            </div>
          </div>

          {/* Content column — 40% */}
          <div className="flex-[0_0_calc(40%-20px)] max-w-[calc(40%-20px)] max-[991px]:flex-[0_0_100%] max-[991px]:max-w-full">
            <div className="flex flex-col items-start gap-5 text-white pl-5 max-[991px]:pl-0 max-[991px]:pt-5 max-[991px]:items-center max-[991px]:text-center">
              <span className="font-montserrat text-[11px] font-medium tracking-[.45em] uppercase banner-gold-label">
                Artisan Extraction
              </span>
              <h2 className="font-cormorant font-light leading-[1.15] tracking-[.04em] text-white m-0 banner-heading-size">
                Alchemical Essence of the Soul
                <span className="banner-divider max-[991px]:mx-auto" />
              </h2>
              <p className="font-montserrat leading-[1.9] tracking-[.02em] m-0 mb-[10px] banner-para-size">
                Crafted in limited batches, each decant of Third Eye Scent marries rare botanical oils with rich resins to
                create a scent profile that transcends the physical realm and evokes spiritual awakening.
              </p>
              <a
                href="#collection"
                className="banner-shop-btn banner-shop-btn-border relative inline-flex items-center gap-3 text-white no-underline font-montserrat text-[11px] font-medium tracking-[.25em] uppercase px-[30px] py-[14px] overflow-hidden transition-all hover:text-[#0f0d0b] hover:-translate-y-[2px] z-[1]"
              >
                <span>Shop Now</span>
                <i className="fa-solid fa-arrow-right text-[10px] transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
