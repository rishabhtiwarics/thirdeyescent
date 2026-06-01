import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'

// Returns icon SVG based on current route
function getPageIcon(pathname) {
  if (pathname.includes('register')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8zM20.4 13.2v2.4h-2.4v2.4h-2.4v-2.4h-2.4v-2.4h2.4v-2.4h2.4v2.4h2.4z" />
      </svg>
    )
  }
  if (pathname.includes('forgot')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z" />
      </svg>
    )
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
  )
}

// Returns right-side content based on route
function getPageContent(pathname) {
  if (pathname.includes('register')) {
    return {
      title: 'Begin Your Olfactory Journey',
      paragraph: 'Join a world of rare fragrances and curated luxury. Create your account and unlock exclusive collections, personalized recommendations, and early access to limited editions crafted for the discerning soul.',
      quote: '"A scent is the most powerful form of memory."',
    }
  }
  if (pathname.includes('forgot')) {
    return {
      title: 'Restore Your Sanctuary',
      paragraph: 'Even the finest of journeys can have a pause. Let us help you reclaim access to your personal scent sanctuary — your curated world of rare aromas awaits your return.',
      quote: '"Fragrance is the unseen, unforgettable, ultimate fashion accessory."',
    }
  }
  return {
    title: 'Welcome Back to Your Scent Sanctuary',
    paragraph: 'Step into a world where every fragrance tells a story. Sign in to explore your curated collection, track your orders, and discover new olfactory masterpieces handpicked for the refined connoisseur.',
    quote: '"Perfume is the art that makes memory speak."',
  }
}

export default function AuthLayout() {
  const { pathname } = useLocation()
  const { title, paragraph, quote } = getPageContent(pathname)

  return (
    <div className="min-h-screen w-full font-montserrat overflow-hidden relative">

      {/* ── Background Video (stays full screen) ── */}
      <video
        autoPlay
        loop
        muted
        playsInline
        src="/img/hero/sliderhero/auth.mp4"
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/75 z-[1]" />

      {/* ── Content Layer ── */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">

        {/* 1100px max-width, mx-auto, 2-col layout */}
        <div
          className="w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16"
          style={{ maxWidth: '1100px', margin: '0 auto' }}
        >

          {/* ══ LEFT: Brand Panel (desktop only) ══ */}
          <div className="hidden lg:flex flex-col flex-1 max-w-[540px] gap-10">

            {/* Top: Logo + Brand Name */}
            <Link to="/" className="flex items-center gap-4 group w-fit">
              <img
                src="/img/logo/logo.png"
                alt="Third Eye Scent"
                className="h-[52px] w-auto object-contain brightness-0 invert group-hover:opacity-80 transition-opacity duration-200"
              />
              <div>
                <p className="font-cormorant text-[24px] font-semibold tracking-widest text-[#f7f5f0] leading-none uppercase">
                  Third Eye Scent
                </p>
                <p className="text-[9px] tracking-[.3em] uppercase text-[#b39874] mt-1.5">
                  Luxury Perfume House
                </p>
              </div>
            </Link>

            {/* Decorative divider */}
            <div className="flex items-center gap-3">
              <div className="h-px w-16 bg-[#b39874]/40"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-[#b39874]/60"></div>
              <div className="h-px w-6 bg-[#b39874]/20"></div>
            </div>

            {/* Bottom: Dynamic page title + paragraph */}
            <div>
              <h2
                className="font-cormorant text-[44px] lg:text-[52px] font-light leading-[1.15] tracking-[.02em] text-[#f7f5f0] mb-6"
                style={{ textShadow: '0 2px 24px rgba(0,0,0,0.6)' }}
              >
                {title}
              </h2>

              <p className="font-montserrat text-[13px] leading-[2] tracking-wide text-[#a39282] mb-10 max-w-[420px]">
                {paragraph}
              </p>

              {/* Italic quote */}
              <div className="border-l-2 border-[#b39874]/50 pl-5 mb-10">
                <p className="font-cormorant italic text-[18px] text-[#b39874] leading-relaxed tracking-wide">
                  {quote}
                </p>
              </div>

              {/* Decorative dots */}
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#b39874]"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-[#b39874]/50"></div>
                <div className="w-1 h-1 rounded-full bg-[#b39874]/20"></div>
              </div>
            </div>
          </div>

          {/* ══ RIGHT: Form Card ══ */}
          <div className="w-full max-w-[420px] shadow-2xl relative flex-shrink-0 overflow-hidden">

            {/* Top Curved Glass Section */}
            <div className="relative w-full">
              <div
                className="w-full flex items-center justify-center relative"
                style={{
                  aspectRatio: '2 / 1',
                  borderBottomLeftRadius: '50% 100%',
                  borderBottomRightRadius: '50% 100%',
                  boxShadow: '0 0 0 9999px white',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)'
                }}
              >
                {/* Logo — click to go home */}
                <Link to="/" className="relative z-10">
                  <img
                    src="/img/logo/logo.png"
                    alt="Third Eye Scent"
                    className="w-[100px] h-auto object-contain drop-shadow-lg pb-4 brightness-0 invert hover:opacity-80 transition-opacity duration-200"
                  />
                </Link>
              </div>

              {/* Center Icon — changes per page */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[70px] h-[70px] bg-[#1a1410] rounded-full flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.3)] z-20 border border-[#b39874]/20">
                <div className="flex items-center justify-center w-full h-full rounded-full text-[#b39874]">
                  {getPageIcon(pathname)}
                </div>
              </div>
            </div>

            {/* Form body */}
            <div className="px-8 pt-12 pb-10 text-gray-900 bg-white relative z-10">
              <Outlet />
            </div>
          </div>

        </div>
      </div>


    </div>
  )
}
