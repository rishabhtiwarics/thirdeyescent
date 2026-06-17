import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/slices/authSlice'
import MiniCart from './cart/MiniCart'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const totalQuantity = useSelector(state => state.cart?.totalQuantity || 0)
  const { isAuthenticated, user } = useSelector(state => state.auth)

  React.useEffect(() => {
    const handleScroll = (e) => {
      let st = 0
      if (e && e.target && typeof e.target.scrollTop === 'number') {
        st = e.target.scrollTop
      } else {
        st = window.scrollY || document.documentElement.scrollTop || 0
      }
      setIsScrolled(st > 50)
    }
    window.addEventListener('scroll', handleScroll, true)
    return () => window.removeEventListener('scroll', handleScroll, true)
  }, [])

  const openMenu = () => {
    setMenuOpen(true)
    document.body.classList.add('overflow-hidden')
  }
  const closeMenu = () => {
    setMenuOpen(false)
    document.body.classList.remove('overflow-hidden')
  }
  const openSearch = () => {
    setSearchOpen(true)
    document.body.classList.add('overflow-hidden')
    setTimeout(() => document.getElementById('searchInput')?.focus(), 120)
  }
  const closeSearch = () => {
    setSearchOpen(false)
    document.body.classList.remove('overflow-hidden')
  }

  React.useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') { closeMenu(); closeSearch() }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  return (
    <>
      {/* MOBILE HEADER */}
      <div
        className={`md:hidden fixed top-0 left-0 w-full flex items-center justify-between px-5 py-3 z-[100] transition-all duration-300 bg-transparent ${isScrolled ? 'opacity-0 pointer-events-none -translate-y-full' : 'opacity-100 translate-y-0'}`}
      >
        <Link to="/" className="flex items-center">
          <img
            src="/img/logo/logo.png"
            alt="Third Eye Scent"
            className="h-[36px] w-auto object-contain brightness-0 invert drop-shadow-md"
            onError={(e) => { e.target.style.display = 'none' }}
          />
        </Link>
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => setIsMiniCartOpen(true)}
            className="relative bg-transparent border-none text-white p-1 flex items-center justify-center cursor-pointer drop-shadow-md"
          >
            <i className="fa-solid fa-bag-shopping text-[22px]" />
            {totalQuantity > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#c9a96e] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalQuantity}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={openMenu}
            className="bg-transparent border-none text-white p-1 flex items-center justify-center cursor-pointer drop-shadow-md"
          >
            <i className="fa-solid fa-bars text-[24px]" />
          </button>
        </div>
      </div>

      {/* HEADER WRAP (DESKTOP) */}
      <div
        className="hidden md:block hdr-desktop-wrap"
        style={{ opacity: isScrolled ? 0 : 1, pointerEvents: isScrolled ? 'none' : 'auto' }}
      >
        <header className="hdr-glass">
          {/* Logo — centered absolutely */}
          <Link to="/" className="hdr-logo-circle">
            <img
              src="/img/logo/logo.png"
              alt="Third Eye Scent"
              className="h-[72px] w-auto block object-contain brightness-0 invert"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.nextElementSibling.style.display = 'block'
              }}
            />
            <div className="hdr-logo-fallback">
              Third Eye Scent
              <span className="hdr-logo-fallback-sub">Luxury Fragrance</span>
            </div>
          </Link>

          {/* Header row */}
          <div className="flex items-center justify-between">
            {/* Left */}
            <div className="flex items-center gap-7">
              <button
                type="button"
                aria-label="Open menu"
                onClick={openMenu}
                className="bg-transparent border-none text-white font-montserrat text-[11px] tracking-[.14em] uppercase cursor-pointer flex items-center gap-[7px] p-0 hover:opacity-60 transition-opacity"
              >
                <i className="fa-solid fa-bars text-[13px]" />
                <span>Menu</span>
              </button>
            </div>

            {/* Right */}
            <div className="flex items-center gap-[22px]">
              <button
                type="button"
                aria-label="Search"
                onClick={openSearch}
                className="bg-transparent border-none text-white cursor-pointer flex items-center gap-[7px] p-0 hover:opacity-60 transition-opacity"
              >
                <i className="fa-solid fa-magnifying-glass hdr-icon-outline" />
              </button>
              {/* User Icon with Hover Dropdown */}
              <div
                className="relative flex items-center"
                onMouseEnter={() => setUserDropdownOpen(true)}
                onMouseLeave={() => setUserDropdownOpen(false)}
              >
                {/* Trigger */}
                <button
                  type="button"
                  className="bg-transparent border-none text-white cursor-pointer flex items-center gap-[7px] p-0 hover:opacity-80 transition-opacity"
                  aria-label="Account"
                >
                  {isAuthenticated && user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-[28px] h-[28px] rounded-full object-cover border border-[#b39874]/40"
                    />
                  ) : (
                    <i className="fa-regular fa-user text-[15px]" />
                  )}
                </button>

                {/* Glass Dropdown */}
                <div
                  className="absolute top-full right-0 pt-5 w-[220px] z-50 transition-all duration-200"
                  style={{
                    opacity: userDropdownOpen ? 1 : 0,
                    pointerEvents: userDropdownOpen ? 'auto' : 'none',
                    transform: userDropdownOpen ? 'translateY(0)' : 'translateY(-8px)',
                  }}
                >
                  {/* Glass card */}
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.10)',
                      backdropFilter: 'blur(20px) saturate(160%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(160%)',
                      border: '1px solid rgba(255, 255, 255, 0.22)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.18)',
                    }}
                    className="rounded-sm overflow-hidden"
                  >
                    {isAuthenticated ? (
                      <>
                        {/* User info */}
                        <div className="px-5 py-4 border-b border-[#c9a96e]/20">
                          <p className="font-cormorant text-[15px] text-white font-semibold leading-tight tracking-wide truncate">
                            {user?.name || 'Patron'}
                          </p>
                          <p className="font-montserrat text-[10px] text-[#c9a96e] tracking-wider mt-0.5 truncate">
                            {user?.email || ''}
                          </p>
                        </div>
                        {/* Logout button */}
                        <button
                          type="button"
                          onClick={() => {
                            dispatch(logout())
                            setUserDropdownOpen(false)
                            navigate('/')
                          }}
                          className="w-full flex items-center gap-3 px-5 py-3.5 font-montserrat text-[10px] tracking-[.18em] uppercase text-white hover:text-[#1a1410] hover:bg-[#c9a96e] transition-colors duration-200 cursor-pointer border-none bg-transparent text-left"
                        >
                          <i className="fa-solid fa-right-from-bracket text-[12px]" />
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        {/* Guest welcome */}
                        <div className="px-5 py-4 border-b border-[#c9a96e]/20">
                          <p className="font-cormorant text-[15px] text-white font-light tracking-wide">
                            Welcome, Patron
                          </p>
                          <p className="font-montserrat text-[10px] text-[#c9a96e] tracking-wider mt-0.5">
                            Sign in to your sanctuary
                          </p>
                        </div>
                        {/* Login button */}
                        <div className="p-4">
                          <Link
                            to="/login"
                            onClick={() => setUserDropdownOpen(false)}
                            className="block w-full text-center font-montserrat text-[10px] font-bold tracking-[.2em] uppercase bg-[#c9a96e] text-[#1a1410] py-2.5 px-4 hover:bg-white transition-colors duration-200"
                          >
                            Sign In
                          </Link>
                          <Link
                            to="/register"
                            onClick={() => setUserDropdownOpen(false)}
                            className="block w-full text-center font-montserrat text-[10px] tracking-[.2em] uppercase text-white border border-[#c9a96e]/40 py-2.5 px-4 mt-2 hover:bg-[#c9a96e] hover:text-[#1a1410] transition-colors duration-200"
                          >
                            Create Account
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsMiniCartOpen(true)}
                className="relative bg-transparent border-none text-white cursor-pointer flex items-center justify-center p-0 hover:opacity-60 transition-opacity"
                aria-label="Cart"
              >
                <i className="fa-solid fa-bag-shopping hdr-icon-outline" />
                {totalQuantity > 0 && (
                  <span className="absolute -top-[6px] -right-[8px] bg-[#c9a96e] text-white text-[9px] font-bold w-[16px] h-[16px] rounded-full flex items-center justify-center leading-none">
                    {totalQuantity}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* MENU BACKDROP */}
      <div
        onClick={closeMenu}
        aria-hidden="true"
        className="menu-backdrop"
        style={{ opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? 'auto' : 'none' }}
      />

      {/* MENU DRAWER */}
      <aside
        id="menuDrawer"
        aria-label="Main menu"
        aria-hidden={!menuOpen}
        className="menu-drawer"
        style={{ transform: menuOpen ? 'translateX(0)' : 'translateX(-120%)' }}
      >
        {/* Drawer Head */}
        <div className="drawer-head">
          <Link to="/" onClick={closeMenu} className="flex items-center gap-[14px] text-white no-underline">
            <img src="/img/logo/logo.png" alt="Third Eye Scent" className="drawer-logo-img" />
            <span>
              <span className="drawer-logo-name">Third Eye Scent</span>
              <small className="drawer-logo-sub">Luxury Fragrance</small>
            </span>
          </Link>
          <button type="button" aria-label="Close menu" onClick={closeMenu} className="drawer-close-btn">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="drawer-body">
          <p className="drawer-kicker">Perfume Boutique</p>

          <nav className="drawer-nav">
            <Link to="/" onClick={closeMenu} className="drawer-nav-link">
              Home
            </Link>
            
            {/* Shop accordion */}
            <div>
              <button
                type="button"
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                aria-expanded={categoriesOpen}
                className="drawer-cat-toggle"
                style={{ color: categoriesOpen ? '#fff' : 'rgba(255,255,255,0.65)' }}
              >
                <span>Shop</span>
                <i
                  className="fa-solid fa-chevron-down text-[12px] text-white/60 transition-transform duration-[250ms]"
                  style={{ transform: categoriesOpen ? 'rotate(180deg)' : 'rotate(0)' }}
                />
              </button>
              <div
                className="drawer-cat-panel"
                style={{ gridTemplateRows: categoriesOpen ? '1fr' : '0fr' }}
              >
                <div className="overflow-hidden flex flex-col">
                  <Link to="/shop" onClick={closeMenu} className="drawer-cat-link">
                    All Products
                  </Link>
                  <Link to="/shop?category=Oud" onClick={closeMenu} className="drawer-cat-link">
                    Oud
                  </Link>
                  <Link to="/shop?category=Rose" onClick={closeMenu} className="drawer-cat-link">
                    Rose
                  </Link>
                  <Link to="/shop?category=Musk" onClick={closeMenu} className="drawer-cat-link">
                    Musk
                  </Link>
                </div>
              </div>
            </div>
            <Link to="/about" onClick={closeMenu} className="drawer-nav-link">
              About
            </Link>
            <Link to="/contact" onClick={closeMenu} className="drawer-nav-link">
              Contact
            </Link>
          </nav>

          {/* Mobile Auth Section in Drawer Body */}
          <div className="mt-8 pt-6 border-t border-[#c9a96e]/20 pb-4">
            {isAuthenticated ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-[45px] h-[45px] rounded-full object-cover border border-[#b39874]/40"
                    />
                  ) : (
                    <div className="w-[45px] h-[45px] rounded-full bg-white/10 flex items-center justify-center border border-[#b39874]/40">
                      <i className="fa-regular fa-user text-[20px] text-white" />
                    </div>
                  )}
                  <div>
                    <p className="font-cormorant text-[18px] text-white font-semibold leading-tight tracking-wide">
                      {user?.name || 'Patron'}
                    </p>
                    <p className="font-montserrat text-[12px] text-[#c9a96e] tracking-wider mt-1 truncate max-w-[150px]">
                      {user?.email || ''}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    dispatch(logout())
                    closeMenu()
                    navigate('/')
                  }}
                  className="w-full flex items-center justify-center gap-3 py-3 mt-2 font-montserrat text-[11px] tracking-[.15em] uppercase text-white border border-white/20 rounded hover:bg-white hover:text-black transition-colors duration-200"
                >
                  <i className="fa-solid fa-right-from-bracket" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <p className="font-cormorant text-[16px] text-white mb-2">My Account</p>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="w-full text-center font-montserrat text-[11px] font-bold tracking-[.2em] uppercase bg-[#c9a96e] text-[#1a1410] py-3 rounded hover:bg-white transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="w-full text-center font-montserrat text-[11px] tracking-[.2em] uppercase text-white border border-[#c9a96e]/40 py-3 rounded hover:bg-[#c9a96e] hover:text-[#1a1410] transition-colors duration-200"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Drawer Foot */}
        <div className="drawer-foot">
          <p className="drawer-foot-title">Private Scent Rituals</p>
          <p className="drawer-foot-text">
            Discover extrait, oud, musk and amber compositions crafted for a lasting signature.
          </p>
          <Link to="/shop" onClick={closeMenu} className="drawer-foot-link">
            Explore Collection <i className="fa-solid fa-arrow-right-long" />
          </Link>
        </div>
      </aside>

      {/* SEARCH MODAL */}
      <div
        id="searchModal"
        aria-hidden={!searchOpen}
        onClick={closeSearch}
        className="search-modal-wrap"
        style={{ opacity: searchOpen ? 1 : 0, pointerEvents: searchOpen ? 'auto' : 'none' }}
      >
        <div
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
          className="search-panel"
          style={{ transform: searchOpen ? 'translateY(0) scale(1)' : 'translateY(-18px) scale(.98)' }}
        >
          {/* Search head */}
          <div className="search-head">
            <div className="flex items-center gap-[14px] min-w-0">
              <img
                src="/img/logo/logo.png"
                alt="Third Eye Scent"
                className="w-[58px] h-[58px] object-contain brightness-0 invert flex-shrink-0"
              />
              <div>
                <p className="search-brand-title">Third Eye Scent</p>
                <p className="search-brand-sub">Search perfume notes, collections and gifts</p>
              </div>
            </div>
            <button type="button" aria-label="Close search" onClick={closeSearch} className="search-close-btn">
              <i className="fa-solid fa-xmark" />
            </button>
          </div>

          {/* Search body */}
          <div className="search-body">
            <div className="search-form-wrap">
              <i className="fa-solid fa-magnifying-glass search-form-icon" />
              <input
                id="searchInput"
                type="search"
                placeholder="Search perfume, oud, musk, amber..."
                className="search-input"
              />
              <button type="submit" className="search-submit-btn">Search</button>
            </div>
            <div className="flex flex-wrap gap-[10px] mt-[22px]">
              {['Oud Noir', 'Rose', 'Vetiver', 'Gift Sets'].map((tag) => (
                <a key={tag} href="#collection" onClick={closeSearch} className="search-tag-link">
                  {tag}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MINI CART DRAWER */}
      <MiniCart isOpen={isMiniCartOpen} onClose={() => setIsMiniCartOpen(false)} />
    </>
  )
}