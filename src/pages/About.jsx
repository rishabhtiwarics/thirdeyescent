import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import SocialMarquee from '../components/SocialMarquee'

export default function About() {
  const [heroVisible, setHeroVisible] = useState(false)
  const heroRef = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {/* ══ ABOUT HERO ══ */}
      <section
        ref={heroRef}
        className="relative w-full overflow-hidden shop-hero-section"
      >
        {/* Background image with parallax feel */}
        <div className="absolute inset-0 z-0">
          <img
            src="/img/hero/shopbnr2.png"
            alt="About Us Background"
            className="w-full h-full object-cover object-[center_35%]"
            style={{ transition: 'transform 12s ease-out', transformOrigin: 'center 35%' }}
          />
          {/* Dark luxury overlay with reduced opacity */}
          <div className="absolute inset-0 shop-hero-overlay opacity-50" />
        </div>

        {/* Hero Content (Positioned at bottom center) */}
        <div className="relative z-10 w-full flex flex-col items-center justify-end px-4 pb-12" style={{ minHeight: '60vh' }}>
          {/* Breadcrumb with Glass Gold Effect */}
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
              <Link to="/" className="hover:text-[#c9a96e] transition-colors">
                Home
              </Link>
              <span className="text-white/40">/</span>
              <h1 className="text-[#c9a96e] m-0 font-normal inline-block">
                Our Story
              </h1>
            </nav>
          </div>
        </div>
      </section>

      {/* ══ FOUNDER SECTION (Redesigned) ══ */}
      <section className="bg-white py-[100px] md:py-[140px] w-full overflow-hidden">
        <div className="w-full max-w-[1320px] mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-16 md:gap-24">
            
            {/* Left: Image with Modern Offset Frame */}
            <div className="w-full md:w-[45%] relative">
              {/* Elegant offset border */}
              <div className="absolute -top-6 -left-6 w-full h-full border border-[#c9a96e]/40 z-0 hidden md:block transition-transform duration-[800ms] hover:-translate-x-2 hover:-translate-y-2" />
              <div className="relative w-full aspect-[3/4] overflow-hidden z-10 shadow-xl bg-[#fcfaf8] group">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80"
                  alt="Our Founder"
                  className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-105 opacity-95"
                />
              </div>
            </div>

            {/* Right: Content with Modern Typography */}
            <div className="w-full md:w-[55%] flex flex-col items-start text-left relative pt-8 md:pt-0">
              {/* Decorative Giant Quote Mark */}
              <div className="absolute -top-12 -left-4 md:-left-12 text-[#c9a96e]/10 font-cormorant text-[160px] md:text-[200px] leading-none select-none z-0">
                “
              </div>

              <div className="relative z-10 w-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-[30px] h-[1px] bg-[#c9a96e]" />
                  <span className="font-montserrat text-[10px] tracking-[.40em] uppercase text-[#c9a96e]">
                    The Visionary
                  </span>
                </div>

                <h2 className="font-cormorant font-light text-[40px] md:text-[52px] leading-[1.15] tracking-[.04em] text-[#1a1410] mb-10">
                  Master of Alchemy <br className="hidden md:block"/> & Rare Botanicals
                </h2>
                
                <div className="pl-6 md:pl-8 border-l border-[#c9a96e]/30">
                  <p className="font-cormorant text-[20px] md:text-[24px] leading-[1.6] tracking-[.02em] text-[#1a1410] italic mb-6">
                    "Our journey began with a singular obsession: to unearth the most elusive absolutes and resins hidden across the globe. Each creation is a manifestation of memory, emotion, and an unwavering commitment to the timeless art of haute parfumerie."
                  </p>
                  
                  <p className="font-montserrat text-[12px] md:text-[13px] leading-[2] tracking-[.04em] text-[#1a1410]/70 mb-10">
                    With an uncompromising dedication to craftsmanship, our founder personally oversees the maceration and maturation of every blend, ensuring that each flacon carries a spirit of true luxury and profound depth.
                  </p>

                  <div className="flex items-center gap-5">
                    <div className="w-[45px] h-[45px] rounded-full flex items-center justify-center border border-[#c9a96e]/40 shadow-sm bg-[#fcfaf8]">
                      <img src="/img/logo/logo.png" alt="Seal" className="w-[60%] h-[60%] object-contain opacity-40 grayscale" />
                    </div>
                    <div className="font-cormorant text-[22px] tracking-[.06em] text-[#1a1410]/90">
                      — The Founder
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══ VISION & MISSION SECTION ══ */}
      <section className="bg-[#fcfaf8] py-[90px] w-full border-t border-b border-[#1a1410]/5">
        <div className="w-full max-w-[1320px] mx-auto px-6">
          <div className="text-center mb-[60px]">
            <p className="font-montserrat text-[10px] tracking-[.40em] uppercase mb-2 text-[#c9a96e]">
              Our Philosophy
            </p>
            <h2 className="font-cormorant font-light text-[36px] tracking-[.06em] text-[#1a1410]">
              Vision & Mission
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 relative">
            {/* Divider Line (Desktop) */}
            <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-[1px] bg-[#1a1410]/10 -translate-x-1/2" />
            
            {/* Vision */}
            <div className="flex flex-col items-center text-center px-4">
              <div className="w-[60px] h-[60px] rounded-full border border-[#c9a96e] flex items-center justify-center mb-6">
                <i className="fa-regular fa-eye text-[20px] text-[#c9a96e]" />
              </div>
              <h3 className="font-cormorant text-[28px] text-[#1a1410] mb-4">Our Vision</h3>
              <p className="font-montserrat text-[13px] leading-[1.8] tracking-[.04em] text-[#1a1410]/70">
                To redefine modern luxury by resurrecting the ancient alchemical traditions of scent creation. We envision a world where perfume is not merely worn, but experienced as a spiritual sanctuary—a "Third Eye" awakening the senses to unparalleled olfactory beauty.
              </p>
            </div>

            {/* Mission */}
            <div className="flex flex-col items-center text-center px-4">
              <div className="w-[60px] h-[60px] rounded-full border border-[#c9a96e] flex items-center justify-center mb-6">
                <i className="fa-solid fa-leaf text-[20px] text-[#c9a96e]" />
              </div>
              <h3 className="font-cormorant text-[28px] text-[#1a1410] mb-4">Our Mission</h3>
              <p className="font-montserrat text-[13px] leading-[1.8] tracking-[.04em] text-[#1a1410]/70">
                To source the most exquisite, ethically harvested raw materials from the farthest corners of the earth. We are committed to meticulous artisanship, blending tradition with innovation to craft sustainable, transcendent fragrances that leave a profound legacy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ HURRY UP CTA SECTION ══ */}
      <section className="relative w-full flex items-center justify-center py-[60px] md:py-[80px] overflow-hidden">
        {/* Background Image & Overlays matching MiddleBanner */}
        <div className="absolute inset-0 z-[1] banner-overlay" />
        <div className="absolute inset-0 z-0">
          <img
            src="/img/hero/mddlebnr.png"
            alt="Hurry Up CTA"
            className="w-full h-full object-cover animate-breath"
          />
        </div>

        <div className="relative z-[2] max-w-[900px] mx-auto px-6 text-center flex flex-col items-center">
          <span className="font-montserrat text-[11px] font-medium tracking-[.45em] uppercase text-[#c9a96e] mb-3">
            Limited Reserve
          </span>
          <h2 className="font-cormorant font-light text-[36px] md:text-[46px] leading-[1.1] tracking-[.04em] text-white mb-4">
            Hurry Up! Experience True Alchemy.
          </h2>
          <p className="font-montserrat text-[12px] md:text-[13px] leading-[1.8] tracking-[.02em] text-white/90 mb-7 max-w-[600px]">
            Our exclusive batches are meticulously aged and produced in very limited quantities. 
            Secure your signature scent before this rare harvest is gone forever.
          </p>
          <Link
            to="/shop"
            className="relative inline-flex items-center gap-3 text-white no-underline font-montserrat text-[11px] font-bold tracking-[.25em] uppercase px-[30px] py-[12px] overflow-hidden transition-all hover:bg-white hover:text-[#0f0d0b] border border-white/40 group"
          >
            <span>Explore Collection</span>
            <i className="fa-solid fa-arrow-right text-[10px] transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Social Marquee */}
      <SocialMarquee />
    </>
  )
}
