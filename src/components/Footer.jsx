import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSiteContent } from '../context/SiteContentContext'
import { newsletterAPI } from '../services/api'

const footerCats = [
  { img: '/img/footerimg/fotone.png', label: 'Women' },
  { img: '/img/footerimg/fottwo.png', label: 'Men' },
  { img: '/img/footerimg/fotthree.png', label: 'Scents' },
]

const socialLinks = [
  { icon: 'fa-brands fa-instagram', label: 'Instagram' },
  { icon: 'fa-brands fa-facebook-f', label: 'Facebook' },
  { icon: 'fa-brands fa-pinterest-p', label: 'Pinterest' },
  { icon: 'fa-brands fa-x-twitter', label: 'X / Twitter' },
  { icon: 'fa-brands fa-youtube', label: 'YouTube' },
  { icon: 'fa-brands fa-weixin', label: 'WeChat' },
]

const bottomLinks = ['Privacy Policy', 'Cookie Settings', 'Legal', 'Accessibility', 'Sitemap']

export default function Footer() {
  const { settings, menus } = useSiteContent()
  const [email, setEmail] = useState('')
  const [subscribeState, setSubscribeState] = useState('')
  const siteName = settings?.siteName || 'Third Eye Scent'
  const logo = settings?.logo || '/img/logo/logo.png'
  const footerMenu = menus?.footer?.items?.slice().sort((a, b) => (a.order || 0) - (b.order || 0)) || []
  const socialMap = {
    Instagram: settings?.socialLinks?.instagram,
    Facebook: settings?.socialLinks?.facebook,
    'X / Twitter': settings?.socialLinks?.twitter,
    YouTube: settings?.socialLinks?.youtube,
  }

  const handleSubscribe = async () => {
    if (!email.trim()) return
    setSubscribeState('submitting')
    try {
      await newsletterAPI.subscribe(email.trim())
      setEmail('')
      setSubscribeState('success')
    } catch (error) {
      setSubscribeState(error.message || 'Unable to subscribe')
    }
  }

  return (
    <footer id="site-footer" className="footer-root">

      {/* Top band */}
      <div className="footer-gold-band">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-10 py-5 flex-wrap max-[992px]:flex-col max-[992px]:items-center">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a href="#">
                <img
                  src={logo}
                  alt={siteName}
                  className="h-[100px] w-auto footer-logo-filter"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextElementSibling.style.display = 'block'
                  }}
                />
                <span className="font-cormorant text-[26px] tracking-[.18em] uppercase no-underline block footer-logo-fallback">
                  {siteName}
                  <span className="block font-montserrat text-[8px] tracking-[.45em] mt-[3px] footer-logo-fallback-sub">Luxury Fragrance</span>
                </span>
              </a>
            </div>

            {/* Newsletter */}
            <div className="flex items-center gap-8 flex-1 justify-end flex-wrap max-[992px]:flex-col max-[992px]:items-center max-[992px]:gap-[10px]">
              <div className="flex flex-col gap-[5px] flex-shrink-0 max-[992px]:items-center max-[992px]:text-center">
                <p className="font-cormorant text-[17px] tracking-[.07em] text-white whitespace-nowrap m-0">Stay in the World of {siteName}</p>
                <p className="font-montserrat text-[10px] leading-[1.65] max-w-[220px] m-0 footer-newsletter-sub">Exclusive updates on new collections &amp; events curated for you.</p>
              </div>
              <div className="flex overflow-hidden flex-shrink-0 footer-input-wrap">
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Your e-mail address"
                  className="w-[190px] border-0 outline-0 px-[14px] py-[10px] font-montserrat text-[10px] tracking-[.1em] text-white placeholder:text-white/30 footer-input-field"
                />
                <button
                  type="button"
                  onClick={handleSubscribe}
                  disabled={subscribeState === 'submitting'}
                  className="px-4 py-[10px] font-montserrat text-[10px] tracking-[.14em] uppercase text-white whitespace-nowrap cursor-pointer transition-colors hover:bg-white/20 footer-subscribe-btn"
                >
                  {subscribeState === 'submitting' ? 'Joining...' : subscribeState === 'success' ? 'Joined' : 'Subscribe'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="footer-main-wrap w-full relative z-[2]">
        <div className="container mx-auto px-4 grid gap-[40px] lg:gap-[52px] items-start py-[40px] lg:py-[60px] grid-cols-1 lg:grid-cols-[1.1fr_1.6fr_1.1fr]">

          {/* About */}
          <div className="max-[992px]:text-center">
            <p className="font-montserrat text-[11px] font-medium tracking-[.28em] uppercase mb-[18px] pb-[10px] footer-section-label">About</p>
            <div className="font-montserrat text-[11px] leading-[1.9] text-[#3a3530]">
              <strong className="block font-cormorant text-[20px] font-normal tracking-[.06em] text-[#0f0d0b] mb-[10px]">{siteName}</strong>
              {settings?.siteDescription || "A fragrance house born from the intersection of intuition and artistry. Every scent is a meditation — crafted to awaken the senses, transcend the ordinary, and leave an impression that lingers long after you've gone."}
            </div>
            <div className="flex gap-[10px] mt-5 flex-wrap max-[992px]:justify-center">
              {socialLinks.map(({ icon, label }) => (
                <a
                  key={label}
                  href={socialMap[label] || '#'}
                  aria-label={label}
                  className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[11px] no-underline transition-all hover:bg-black/7 hover:text-black hover:border-black/40 footer-social-link"
                >
                  <i className={icon} />
                </a>
              ))}
            </div>
          </div>

          {/* Collections grid */}
          <div>
            <p className="font-montserrat text-[11px] font-medium tracking-[.28em] uppercase mb-[18px] pb-[10px] footer-section-label">Collections</p>
            <div className="grid grid-cols-3 gap-[6px]">
              {footerCats.map(({ img, label }) => (
                <div key={label} className="relative overflow-hidden rounded-[2px] cursor-pointer group" style={{ aspectRatio: '3/4' }}>
                  <img
                    src={img}
                    alt={label}
                    className="w-full h-full object-cover object-top block transition-all duration-700 group-hover:scale-[1.06] footer-cat-img"
                  />
                  <div className="absolute inset-0 pointer-events-none footer-cat-overlay" />
                  <span className="absolute bottom-[10px] left-0 right-0 z-[2] text-center font-montserrat text-[9px] tracking-[.22em] uppercase text-white/90">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact — hidden on mobile */}
          <div className="hidden lg:block">
            <p className="font-montserrat text-[11px] font-medium tracking-[.28em] uppercase mb-[18px] pb-[10px] footer-section-label">Contact</p>
            <div className="flex flex-col gap-[18px]">
              <div className="flex items-start gap-[11px]">
                <div className="w-[28px] h-[28px] flex-shrink-0 rounded-full flex items-center justify-center text-[10px] mt-[2px] footer-contact-icon">
                  <i className="fa-solid fa-location-dot" />
                </div>
                <div>
                  <p className="font-montserrat text-[8.5px] tracking-[.18em] uppercase mb-[3px] footer-contact-kicker">Flagship</p>
                  <p className="font-cormorant text-[15px] tracking-[.03em] text-[#0f0d0b] leading-[1.3]">{settings?.address || '101 Ave. des Champs-Élysées'}</p>
                </div>
              </div>
              <div className="flex items-start gap-[11px]">
                <div className="w-[28px] h-[28px] flex-shrink-0 rounded-full flex items-center justify-center text-[10px] mt-[2px] footer-contact-icon">
                  <i className="fa-solid fa-phone" />
                </div>
                <div>
                  <p className="font-montserrat text-[8.5px] tracking-[.18em] uppercase mb-[3px] footer-contact-kicker">Client Services</p>
                  <p className="font-cormorant text-[15px] tracking-[.03em] text-[#0f0d0b] leading-[1.3]">{settings?.contactPhone || '+1 866 884 8866'}</p>
                  <p className="font-montserrat text-[9px] tracking-[.05em] mt-[2px] footer-contact-sub">{settings?.contactEmail || 'Mon – Sat | 10:00 – 19:00'}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="py-[18px] footer-gold-band footer-gold-band-top">
        <div className="container mx-auto px-4 flex items-center justify-between flex-wrap gap-2">
          <span className="font-montserrat text-[10px] tracking-[.12em] uppercase text-white/65">© 2026 {siteName}. All rights reserved.</span>
          <div className="flex gap-6 flex-wrap">
            {(footerMenu.length ? footerMenu : bottomLinks.map((label) => ({ label, url: '#' }))).map((item) => (
              <Link key={`${item.label}-${item.url}`} to={item.url} className="font-montserrat text-[10px] tracking-[.10em] uppercase text-white/60 no-underline transition-colors hover:text-white">{item.label}</Link>
            ))}
          </div>
        </div>
      </div>

    </footer>
  )
}
