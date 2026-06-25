import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { bannerAPI, menuAPI, settingsAPI } from '../services/api'

const SiteContentContext = createContext({
  settings: null,
  menus: {},
  banners: [],
  loading: true,
  refresh: async () => {},
})

export function SiteContentProvider({ children }) {
  const [settings, setSettings] = useState(null)
  const [menus, setMenus] = useState({})
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    setLoading(true)
    const [settingsResult, headerResult, footerResult, mobileResult, bannerResult] = await Promise.allSettled([
      settingsAPI.getSettings(),
      menuAPI.getMenuByLocation('header'),
      menuAPI.getMenuByLocation('footer'),
      menuAPI.getMenuByLocation('mobile'),
      bannerAPI.getActiveBanners('homepage'),
    ])

    if (settingsResult.status === 'fulfilled') setSettings(settingsResult.value)
    setMenus({
      header: headerResult.status === 'fulfilled' ? headerResult.value : null,
      footer: footerResult.status === 'fulfilled' ? footerResult.value : null,
      mobile: mobileResult.status === 'fulfilled' ? mobileResult.value : null,
    })
    if (bannerResult.status === 'fulfilled') setBanners(Array.isArray(bannerResult.value) ? bannerResult.value : [])
    setLoading(false)
  }

  useEffect(() => {
    refresh()
  }, [])

  const value = useMemo(() => ({ settings, menus, banners, loading, refresh }), [settings, menus, banners, loading])

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>
}

export const useSiteContent = () => useContext(SiteContentContext)
