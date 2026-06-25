import React, { useEffect, useMemo, useState } from 'react'
import { useSiteContent } from '../context/SiteContentContext'

export default function AnnouncementBar() {
  const { settings } = useSiteContent()
  const [activeIndex, setActiveIndex] = useState(0)
  const messages = useMemo(
    () => (settings?.announcementItems || []).map((item) => item.trim()).filter(Boolean),
    [settings?.announcementItems],
  )

  useEffect(() => {
    setActiveIndex(0)
    if (messages.length < 2) return undefined

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % messages.length)
    }, 4500)

    return () => window.clearInterval(timer)
  }, [messages])

  if (!messages.length) return null

  return (
    <aside
      className="announcement-bar fixed inset-x-0 top-0 z-[210] h-8 overflow-hidden px-10 text-white"
      aria-label="Store announcements"
    >
      <div className="flex h-full items-center justify-center">
        <p
          key={`${activeIndex}-${messages[activeIndex]}`}
          className="announcement-message truncate text-center font-montserrat text-[9px] uppercase tracking-[.2em] md:text-[10px] md:tracking-[.28em]"
          aria-live="polite"
        >
          {messages[activeIndex]}
        </p>
      </div>
      {messages.length > 1 && (
        <div className="absolute right-3 top-1/2 flex -translate-y-1/2 gap-1" aria-hidden="true">
          {messages.map((message, index) => (
            <span
              key={`${message}-${index}`}
              className={`h-1 w-1 rounded-full transition-opacity ${index === activeIndex ? 'bg-white' : 'bg-white/35'}`}
            />
          ))}
        </div>
      )}
    </aside>
  )
}
