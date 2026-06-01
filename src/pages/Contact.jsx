import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import SocialMarquee from '../components/SocialMarquee'

export default function Contact() {
  const [heroVisible, setHeroVisible] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [status, setStatus] = useState('')
  const heroRef = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('Please fill in all fields.')
      return
    }
    // Simulate API call
    setStatus('Sending...')
    setTimeout(() => {
      setStatus('Thank you for reaching out! We will contact you shortly.')
      setFormData({ name: '', email: '', message: '' })
    }, 1500)
  }

  return (
    <>
      {/* 🏬 CONTACT HERO (Same as Shop Hero) 🏬 */}
      <section
        ref={heroRef}
        className="relative w-full overflow-hidden shop-hero-section"
      >
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/img/hero/shopbnr2.png"
            alt="Contact Background"
            className="w-full h-full object-cover object-[center_35%]"
            style={{ transition: 'transform 12s ease-out', transformOrigin: 'center 35%' }}
          />
          {/* Dark luxury overlay */}
          <div className="absolute inset-0 shop-hero-overlay opacity-50" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full flex flex-col items-center justify-end px-4 pb-12" style={{ minHeight: '60vh' }}>
          {/* Breadcrumb with Glass Gold Effect - Sharp Borders */}
          <div
            className="footer-gold-band backdrop-blur-xl border border-[#c9a96e]/40 shadow-2xl px-6 py-3 flex items-center gap-3"
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
              <h1 className="text-[#c9a96e] m-0 font-normal inline-block text-[10px] tracking-[.25em]">
                Contact Us
              </h1>
            </nav>
          </div>
        </div>
      </section>

      {/* 📞 CONTACT INFORMATION & BRAND IMAGE SECTION 📞 */}
      <section className="bg-white py-[72px] w-full border-b border-[#1a1410]/5">
        <div className="w-full max-w-[1320px] mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Side: Info */}
            <div className="lg:col-span-7 pr-0 lg:pr-8">
              <span className="font-montserrat text-[10px] tracking-[.40em] uppercase mb-3 block text-[#c9a96e]">
                Connect With Us
              </span>
              <h2 className="font-cormorant font-light tracking-[.06em] text-[#1a1410] text-3xl md:text-4xl mb-4">
                Contact Information
              </h2>
              <p className="font-montserrat text-[11px] tracking-[.05em] leading-relaxed text-[#1a1410]/60 mb-10 max-w-[600px]">
                We welcome you to connect with Third Eye Scent. Whether you have inquiries about our custom oud extraction process, private collections, or bespoke client services, our team is at your service.
              </p>

              {/* Three blocks in a row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">

                {/* Phone Card - Square badge */}
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                  <div className="w-12 h-12 bg-[#1a1510] text-[#c9a96e] flex items-center justify-center mb-4 transition-transform hover:scale-105 duration-300">
                    <i className="fa-solid fa-phone text-base" />
                  </div>
                  <h4 className="font-cormorant text-lg text-[#1a1410] mb-1 font-semibold tracking-wide">Phone</h4>
                  <p className="font-montserrat text-[11px] font-medium text-[#1a1410] tracking-wide mb-1">(+654) 6544 55</p>
                  <p className="font-montserrat text-[9px] text-[#1a1410]/40 tracking-wider">Lorem ipsum dolor sit</p>
                </div>

                {/* Email Card - Square badge */}
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                  <div className="w-12 h-12 bg-[#1a1510] text-[#c9a96e] flex items-center justify-center mb-4 transition-transform hover:scale-105 duration-300">
                    <i className="fa-solid fa-envelope text-base" />
                  </div>
                  <h4 className="font-cormorant text-lg text-[#1a1410] mb-1 font-semibold tracking-wide">Email</h4>
                  <p className="font-montserrat text-[11px] font-medium text-[#1a1410] tracking-wide mb-1">client@thirdeyescent.com</p>
                  <p className="font-montserrat text-[9px] text-[#1a1410]/40 tracking-wider">Lorem ipsum dolor sit</p>
                </div>

                {/* Location Card - Square badge */}
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                  <div className="w-12 h-12 bg-[#1a1510] text-[#c9a96e] flex items-center justify-center mb-4 transition-transform hover:scale-105 duration-300">
                    <i className="fa-solid fa-location-dot text-base" />
                  </div>
                  <h4 className="font-cormorant text-lg text-[#1a1410] mb-1 font-semibold tracking-wide">Location</h4>
                  <p className="font-montserrat text-[11px] font-medium text-[#1a1410] tracking-wide mb-1">London Eye, UK</p>
                  <p className="font-montserrat text-[9px] text-[#1a1410]/40 tracking-wider">Lorem ipsum dolor sit</p>
                </div>

              </div>
            </div>

            {/* Right Side: Showcase Scent Image - Square borders */}
            <div className="lg:col-span-5">
              <div className="relative p-2 border border-[#c9a96e]/30 overflow-hidden group shadow-2xl bg-warm-beige">
                <img
                  src="/img/hero/contact.png"
                  alt="Luxury Scent Bottle"
                  className="w-full h-[360px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ✉️ GET IN TOUCH & LOCATION SECTION ✉️ */}
      <section className="bg-white py-[72px] w-full">
        <div className="w-full max-w-[1320px] mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* Left Side: White Contact Form (Matching Checkout page form style) */}
            <div className="lg:col-span-6">
              <div className="bg-white p-6 md:p-10 border border-[#1a1410]/5 shadow-[0_4px_30px_rgba(26,20,16,0.06)] rounded-none text-[#1a1410]">
                <h3 className="font-cormorant font-semibold text-[20px] uppercase tracking-wider text-[#1a1410] border-b border-[#1a1410]/5 pb-2 mb-6">
                  Get In Touch !
                </h3>
                <p className="font-montserrat text-xs text-[#1a1410]/50 tracking-wider mb-6 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field - Checkout Style */}
                  <div>
                    <label className="font-montserrat text-[9px] uppercase tracking-[.15em] text-[#1a1410]/50 font-bold mb-1.5 block">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your Email"
                      className="w-full border border-[#1a1410]/15 rounded-none px-4 py-3 font-montserrat text-xs outline-none focus:border-[#c9a96e] focus:bg-white focus:ring-1 focus:ring-[#c9a96e] bg-[#fffaf4]/30 text-[#1a1410] placeholder-[#1a1410]/25 transition-all duration-200"
                      required
                    />
                  </div>

                  {/* Name Field - Checkout Style */}
                  <div>
                    <label className="font-montserrat text-[9px] uppercase tracking-[.15em] text-[#1a1410]/50 font-bold mb-1.5 block">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your Name"
                      className="w-full border border-[#1a1410]/15 rounded-none px-4 py-3 font-montserrat text-xs outline-none focus:border-[#c9a96e] focus:bg-white focus:ring-1 focus:ring-[#c9a96e] bg-[#fffaf4]/30 text-[#1a1410] placeholder-[#1a1410]/25 transition-all duration-200"
                      required
                    />
                  </div>

                  {/* Message Field - Checkout Style */}
                  <div>
                    <label className="font-montserrat text-[9px] uppercase tracking-[.15em] text-[#1a1410]/50 font-bold mb-1.5 block">
                      Message
                    </label>
                    <textarea
                      name="message"
                      rows="4"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Your Message"
                      className="w-full border border-[#1a1410]/15 rounded-none px-4 py-3 font-montserrat text-xs outline-none focus:border-[#c9a96e] focus:bg-white focus:ring-1 focus:ring-[#c9a96e] bg-[#fffaf4]/30 text-[#1a1410] placeholder-[#1a1410]/25 transition-all duration-200 resize-none"
                      required
                    />
                  </div>

                  {/* Submit Button - Checkout Style */}
                  <div>
                    <button
                      type="submit"
                      className="group inline-flex items-center justify-center gap-2.5 bg-[#1a1410] hover:bg-[#c9a96e] text-white hover:text-[#1a1410] font-montserrat text-[11px] font-bold tracking-[.2em] uppercase px-10 py-4 border border-[#1a1410] hover:border-[#c9a96e] transition-all duration-300 rounded-none cursor-pointer shadow-[0_4px_15px_rgba(26,20,16,0.15)] w-full sm:w-auto"
                    >
                      Submit Button
                    </button>
                  </div>
                </form>

                {status && (
                  <p className="mt-6 font-montserrat text-[10px] tracking-wider text-[#c9a96e] font-semibold">
                    {status}
                  </p>
                )}
              </div>
            </div>

            {/* Right Side: Map & Social Media */}
            <div className="lg:col-span-6 flex flex-col justify-between">

              {/* Location Description */}
              <div>
                <span className="font-montserrat text-[10px] tracking-[.40em] uppercase mb-3 block text-[#c9a96e]">
                  Location Map
                </span>
                <h3 className="font-cormorant font-light tracking-[.06em] text-[#1a1410] text-2xl mb-4">
                  Our Location
                </h3>
                <p className="font-montserrat text-[11px] tracking-[.05em] leading-relaxed text-[#1a1410]/60 mb-6">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
                </p>

                {/* Google Map Iframe - Square borders */}
                <div className="w-full border border-[#1a1410]/10 overflow-hidden shadow-md">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2508.461327116812!2d-0.1216891!3d51.503324!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487604b900d26973%3A0x4291f3172409f92!2sLondon%20Eye!5e0!3m2!1sen!2s!4v1716000000000!5m2!1sen!2s"
                    width="100%"
                    height="270"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Google Map London Eye"
                  />
                </div>
              </div>

              {/* Social Media Row - Square social buttons */}
              <div className="mt-8 lg:mt-0 pt-6">
                <h4 className="font-montserrat text-[10px] tracking-[.25em] uppercase text-[#1a1410] mb-4">
                  Social Media
                </h4>
                <div className="flex gap-4">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 border border-[#1a1410]/15 flex items-center justify-center text-[#1a1410]/70 hover:bg-[#1a1410] hover:text-white hover:border-[#1a1410] transition-all"
                  >
                    <i className="fa-brands fa-facebook-f text-sm" />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 border border-[#1a1410]/15 flex items-center justify-center text-[#1a1410]/70 hover:bg-[#1a1410] hover:text-white hover:border-[#1a1410] transition-all"
                  >
                    <i className="fa-brands fa-twitter text-sm" />
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 border border-[#1a1410]/15 flex items-center justify-center text-[#1a1410]/70 hover:bg-[#1a1410] hover:text-white hover:border-[#1a1410] transition-all"
                  >
                    <i className="fa-brands fa-youtube text-sm" />
                  </a>
                  <a
                    href="https://wordpress.org"
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 border border-[#1a1410]/15 flex items-center justify-center text-[#1a1410]/70 hover:bg-[#1a1410] hover:text-white hover:border-[#1a1410] transition-all"
                  >
                    <i className="fa-brands fa-wordpress text-sm" />
                  </a>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Social Marquee Section */}
      <SocialMarquee />
    </>
  )
}
