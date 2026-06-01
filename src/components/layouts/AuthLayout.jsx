import React from 'react'
import { Outlet, Link } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="min-h-screen w-full flex bg-[#0f0d0b] text-[#f7f5f0] font-montserrat overflow-hidden relative">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        src="/img/hero/sliderhero/shophero.mp4"
        className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-80"
      />

      {/* Overlay to darken video slightly */}
      <div className="absolute inset-0 bg-black/40 z-0" />

      {/* Forms container */}
      <div className="w-full min-h-screen flex items-center justify-center p-6 md:p-12 relative z-10">

        {/* The Card */}
        <div className="w-full max-w-[420px] bg-[#1a1410] px-8 pt-16 pb-10 border border-[#b39874]/20 shadow-2xl relative mt-16 rounded-md">

          {/* Top Half Circle with Logo */}
          <div className="absolute -top-[50px] left-1/2 -translate-x-1/2 w-[100px] h-[100px] bg-[#1a1410] rounded-full border border-[#b39874]/20 flex items-center justify-center z-20 shadow-lg overflow-hidden">
            <Link to="/" className="w-full h-full flex items-center justify-center bg-[#1a1410] rounded-full z-10 relative">
              <img
                src="/img/logo/logo.png"
                alt="Third Eye Scent"
                className="h-[55px] w-auto object-contain brightness-0 invert"
              />
            </Link>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  )
}

