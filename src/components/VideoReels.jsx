import React, { useEffect, useRef } from 'react'
import Swiper from 'swiper'
import { Autoplay } from 'swiper/modules'

const reelVideos = [
  '/img/hero/sliderhero/one.mp4',
  '/img/hero/sliderhero/two.mp4',
  '/img/hero/sliderhero/one.mp4',
  '/img/hero/sliderhero/two.mp4',
  '/img/hero/sliderhero/one.mp4',
  '/img/hero/sliderhero/two.mp4',
  '/img/hero/sliderhero/one.mp4',
  '/img/hero/sliderhero/two.mp4',
]

function playActiveReel(swiper) {
  const videos = swiper.el.querySelectorAll('video')
  videos.forEach((v) => v.pause())
  const activeSlide = swiper.el.querySelector('.swiper-slide-active')
  if (activeSlide) {
    const activeVideo = activeSlide.querySelector('video')
    if (activeVideo) {
      activeVideo.muted = true
      activeVideo.play().catch(() => { })
    }
  }
}

export default function VideoReels() {
  const swiperRef = useRef(null)

  useEffect(() => {
    // Clone slides for seamless looping
    const wrapper = swiperRef.current?.querySelector('.swiper-wrapper')
    if (wrapper) {
      const originals = Array.from(wrapper.children)
      for (let i = 0; i < 2; i++) {
        originals.forEach((slide) => {
          wrapper.appendChild(slide.cloneNode(true))
        })
      }
    }

    const swiper = new Swiper(swiperRef.current, {
      modules: [Autoplay],
      slidesPerView: 'auto',
      centeredSlides: true,
      spaceBetween: 12,
      loop: true,
      speed: 800,
      autoplay: { delay: 3500, disableOnInteraction: false },
      slideToClickedSlide: true,
      grabCursor: true,
      watchSlidesProgress: true,
      touchStartPreventDefault: false,
      preventClicks: false,
      preventClicksPropagation: false,
      on: {
        init: playActiveReel,
        slideChange: playActiveReel,
        slideChangeTransitionStart(sw) { sw.allowTouchMove = false },
        slideChangeTransitionEnd(sw) {
          sw.allowTouchMove = true
          playActiveReel(sw)
        },
      },
    })

    return () => swiper.destroy(true, true)
  }, [])

  return (
    <section
      id="video-reels"
      aria-label="Scent Reels Feed"
    >
      {/* Head */}
      <div className="container mx-auto px-4 reels-head-container">
        <div className="reels-head">
          <p className="reels-label">Scent in Motion</p>
          <h2 className="reels-title">The Sensory Reels</h2>
        </div>
      </div>

      {/* Swiper + phone mockup */}
      <div className="reels-swiper-container">

        {/* Phone frame overlay */}
        <div className="reels-phone-mockup">
          <div className="reels-phone-frame">
            <div className="reels-phone-notch" />
          </div>
        </div>

        {/* Swiper */}
        <div
          ref={swiperRef}
          className="swiper reels-swiper-el"
        >
          <div className="swiper-wrapper">
            {reelVideos.map((src, i) => (
              <div key={i} className="swiper-slide">
                <video
                  className="reel-video"
                  src={src}
                  muted
                  playsInline
                  loop
                  preload="metadata"
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
