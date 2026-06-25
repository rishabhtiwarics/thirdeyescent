import React, { useEffect, useRef } from 'react'
import Swiper from 'swiper'
import { Autoplay, Pagination } from 'swiper/modules'
import { useSiteContent } from '../context/SiteContentContext'

export default function Hero() {
  const { banners } = useSiteContent()
  const swiperRef = useRef(null)
  const primaryBanner = banners[0]
  const secondaryBanner = banners[1]

  useEffect(() => {
    const swiper = new Swiper(swiperRef.current, {
      modules: [Autoplay, Pagination],
      direction: 'vertical',
      loop: true,
      speed: 1100,
      autoplay: { delay: 5000, disableOnInteraction: false },
      pagination: {
        el: '.hero-content .hero-pagination',
        clickable: true,
      },
      on: {
        afterInit(sw) {
          const activeVideo = sw.slides[sw.activeIndex]?.querySelector('video')
          if (activeVideo) activeVideo.play()
        },
        slideChangeTransitionStart(sw) {
          sw.slides.forEach((slide) => {
            const v = slide.querySelector('video')
            if (v) { v.pause(); v.currentTime = 0 }
          })
        },
        slideChangeTransitionEnd(sw) {
          const activeVideo = sw.slides[sw.activeIndex]?.querySelector('video')
          if (activeVideo) activeVideo.play()
        },
      },
    })

    return () => swiper.destroy(true, true)
  }, [])

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden flex items-stretch"
    >
      {/* Radial vignette */}
      <div className="absolute inset-0 hero-bg-radial" />

      {/* Hero Grid */}
      <div className="relative z-10 w-full grid hero-grid-mobile md:grid-cols-2 lg:grid-cols-3">
        {/* LEFT COLUMN */}
        <div className="relative overflow-hidden group hero-side-col">
          <img
            src={primaryBanner?.image || '/img/hero/herofirst.png'}
            alt="Collection Left"
            className="w-full h-full object-cover object-top block animate-breath group-hover:scale-[1.04] transition-transform duration-[8000ms]"
          />
          <div className="absolute inset-0 pointer-events-none hero-side-overlay-left" />
          <span className="absolute bottom-10 left-8 font-montserrat text-[10px] tracking-[.3em] uppercase text-white/65 z-[2]">
            {primaryBanner?.title || 'Alpha Mail'}
          </span>
        </div>

        {/* CENTER COLUMN */}
        <div className="relative overflow-hidden flex flex-col items-center justify-end pb-[52px] hero-center-col">
          {/* Video Swiper */}
          <div ref={swiperRef} className="swiper absolute inset-0 w-full h-full">
            <div className="swiper-wrapper h-full">
              <div className="swiper-slide w-full h-full overflow-hidden">
                <video
                  className="w-full h-full object-cover object-top block"
                  src="/img/hero/sliderhero/one.mp4"
                  muted
                  playsInline
                  loop
                  preload="metadata"
                />
              </div>
              <div className="swiper-slide w-full h-full overflow-hidden">
                <video
                  className="w-full h-full object-cover object-top block"
                  src="/img/hero/sliderhero/two.mp4"
                  muted
                  playsInline
                  loop
                  preload="metadata"
                />
              </div>
            </div>
          </div>

          {/* Center overlay */}
          <div className="absolute inset-0 z-[2] pointer-events-none hero-center-overlay" />

          {/* Hero Content */}
          <div className="hero-content relative z-10 text-center text-white px-6">
            <div className="hero-pagination swiper-pagination !static flex justify-center items-center gap-[3px] mb-5 w-full" />
            <h1 className="font-cormorant font-light tracking-[.06em] leading-[1.05] mb-4 text-white hero-title">
              {primaryBanner?.subtitle || primaryBanner?.title || 'Pre-Fall 2026'}
            </h1>
            <a
              href={primaryBanner?.buttonLink || '#collection'}
              className="font-montserrat text-[10px] tracking-[.22em] uppercase text-white no-underline pb-[6px] px-[20px] transition-all hover:opacity-65 inline-block hero-cta-border"
            >
              {primaryBanner?.buttonText || 'DISCOVER THE COLLECTION'}
            </a>
          </div>
        </div>

        {/* RIGHT COLUMN — hidden on md, visible on lg+ */}
        <div className="relative overflow-hidden group hero-side-col hidden lg:block">
          <img
            src={secondaryBanner?.image || primaryBanner?.image || '/img/hero/herothird.png'}
            alt="Collection Right"
            className="w-full h-full object-cover object-top block animate-breath group-hover:scale-[1.04] transition-transform duration-[8000ms]"
          />
          <div className="absolute inset-0 pointer-events-none hero-side-overlay-right" />
          <span className="absolute bottom-10 right-8 font-montserrat text-[10px] tracking-[.3em] uppercase text-white/65 z-[2] text-right">
            {secondaryBanner?.title || primaryBanner?.title || 'Alpha Mail'}
          </span>
        </div>
      </div>
    </section>
  )
}
