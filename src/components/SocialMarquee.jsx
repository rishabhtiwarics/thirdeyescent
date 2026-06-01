import React from 'react'

const galleryImages = [
  { src: '/img/prefallimg/one.png', alt: '@priya.luminous' },
  { src: '/img/prefallimg/two.png', alt: '@tara.essentials' },
  { src: '/img/prefallimg/three.png', alt: '@mei.radiant' },
  { src: '/img/prefallimg/four.png', alt: '@leila.barefaced' },
  { src: '/img/prefallimg/five.png', alt: '@zoe.skinjourney' },
  { src: '/img/prefallimg/six.png', alt: '@maya.scents' },
  { src: '/img/prefallimg/seven.png', alt: '@sarah.glow' },
  { src: '/img/prefallimg/eight.png', alt: '@emma.fragrance' },
]

export default function SocialMarquee() {
  return (
    <section className="bg-[#fcfaf8] py-12 overflow-hidden">
      {/* Header Block matching Figma design */}
      <div className="flex items-center justify-center gap-3 sm:gap-5 mb-8 select-none">
        <span className="font-cormorant font-light tracking-[.06em] text-[#1a1410] collection-title leading-none">
          Follow On
        </span>

        {/* Overlapping Tilted Photos */}
        <div className="relative flex items-center justify-center w-16 xs:w-20 sm:w-24 md:w-28 h-16 sm:h-20 md:h-24">
          {/* Left Photo (Rotated Left) */}
          <div className="absolute w-[40px] h-[48px] xs:w-[48px] xs:h-[58px] sm:w-[56px] sm:h-[68px] md:w-[64px] md:h-[78px] bg-white p-0.5 sm:p-1 shadow-[0_4px_12px_rgba(26,20,16,0.12)] rounded-none border border-white/50 rotate-[-10deg] -translate-x-2.5 sm:-translate-x-3.5 z-10 overflow-hidden">
            <img
              src="/img/prefallimg/one.png"
              alt="Figma Look 1"
              className="w-full h-full object-cover rounded-none"
            />
          </div>
          {/* Right Photo (Rotated Right) */}
          <div className="absolute w-[40px] h-[48px] xs:w-[48px] xs:h-[58px] sm:w-[56px] sm:h-[68px] md:w-[64px] md:h-[78px] bg-white p-0.5 sm:p-1 shadow-[0_4px_12px_rgba(26,20,16,0.15)] rounded-none border border-white/50 rotate-[8deg] translate-x-2.5 sm:translate-x-3.5 z-20 overflow-hidden">
            <img
              src="/img/prefallimg/two.png"
              alt="Figma Look 2"
              className="w-full h-full object-cover rounded-none"
            />
          </div>
        </div>

        <span className="font-cormorant font-light tracking-[.06em] text-[#1a1410] collection-title leading-none">
          Instagram
        </span>
      </div>
      {/* Marquee Section */}
      <div className="relative flex overflow-hidden group w-full">
        <div className="flex gap-4 w-max animate-custom-marquee">
          {[...galleryImages, ...galleryImages].map((img, i) => (
            <div
              key={i}
              className="w-[200px] h-[200px] md:w-[280px] md:h-[280px] rounded-none overflow-hidden relative flex-shrink-0 cursor-pointer"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover object-top transition-transform duration-[800ms] hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-black/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
