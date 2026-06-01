import React from 'react'
import Hero from '../components/Hero'
import Collection from '../components/Collection'
import MiddleBanner from '../components/MiddleBanner'
import GalleryStrip from '../components/GalleryStrip'
import CampaignShop from '../components/CampaignShop'
import VideoReels from '../components/VideoReels'

export default function Home() {
  return (

    <>
      <Hero />
      <Collection />
      <MiddleBanner />
      <GalleryStrip />
      <CampaignShop />
      <VideoReels />
    </>

  )
}
