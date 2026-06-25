import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../Header'
import Footer from '../Footer'
import AnnouncementBar from '../AnnouncementBar'
import { SiteContentProvider } from '../../context/SiteContentContext'

export default function MainLayout() {
  return (
    <SiteContentProvider>
      <div className="flex flex-col min-h-screen">
        <AnnouncementBar />
        <Header />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
      </div>
    </SiteContentProvider>
  )
}
