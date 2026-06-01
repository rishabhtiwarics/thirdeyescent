import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'

// Returns icon SVG based on current route
function getPageIcon(pathname) {
  if (pathname.includes('register')) {
    // User Plus icon for Register
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8zM20.4 13.2v2.4h-2.4v2.4h-2.4v-2.4h-2.4v-2.4h2.4v-2.4h2.4v2.4h2.4z"/>
      </svg>
    )
  }
  if (pathname.includes('forgot')) {
    // Lock icon for Forgot Password
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z"/>
      </svg>
    )
  }
  // Default: Person icon for Login
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
  )
}

export default function AuthLayout() {
  const { pathname } = useLocation()
  return (
    <div className="min-h-screen w-full flex bg-[#0f0d0b] text-[#f7f5f0] font-montserrat overflow-hidden relative">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        src="/img/hero/sliderhero/shophero.mp4"
        className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-60"
      />

      {/* Overlay to darken video slightly */}
      <div className="absolute inset-0 bg-black/60 z-0" />

      {/* Forms container */}
      <div className="w-full min-h-screen flex flex-col items-center justify-center p-6 md:p-12 relative z-10">

        {/* The Card */}
        <div className="w-full max-w-[420px] shadow-2xl relative mb-4 overflow-hidden">

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
              {/* Center Logo — click to go home */}
              <Link to="/" className="relative z-10">
                <img
                  src="/img/logo/logo.png"
                  alt="Third Eye Scent"
                  className="w-[100px] h-auto object-contain drop-shadow-lg pb-4 brightness-0 invert hover:opacity-80 transition-opacity duration-200"
                />
              </Link>
            </div>

            {/* Center Icon Area — changes per page */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[70px] h-[70px] bg-[#1a1410] rounded-full flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.15)] z-20 border border-[#b39874]/20">
              <div className="flex items-center justify-center w-full h-full rounded-full text-[#b39874]">
                {getPageIcon(pathname)}
              </div>
            </div>
          </div>

          {/* Forms container */}
          <div className="px-8 pt-12 pb-10 text-gray-900 relative z-10 bg-white">
            <Outlet />
          </div>

        </div>

        {/* Footer */}
        <div className="mt-6 text-sm text-gray-300 text-center tracking-wide">
          © {new Date().getFullYear()} Third Eye Scent. All rights reserved.
        </div>
      </div>
    </div>
  )
}
