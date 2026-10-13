'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

// Helper to determine if a hex color is "light" or "dark" for text contrast
const isDarkColor = (color: string) => {
  if (!color) return false
  const hex = color.startsWith('#') ? color.replace('#', '') : ''
  if (!hex) return ['chocolate', 'pink', 'blue', 'dark', 'purple'].includes(color)
  const r = parseInt(hex.substring(0, 2), 16) || 0
  const g = parseInt(hex.substring(2, 4), 16) || 0
  const b = parseInt(hex.substring(4, 6), 16) || 0
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance < 0.5
}

// Helper for banner themes
const getBannerGradient = (theme: string) => {
  if (theme?.startsWith('#')) return theme // Solid hex color
  switch (theme) {
    case 'chocolate': return '#5D4037'
    case 'gold': return '#FBC02D'
    case 'pink': return '#E91E63'
    case 'blue': return '#1976D2'
    case 'dark': return '#1e3f20'
    default: return '#FDFBF7'
  }
}

// Check if theme is exactly the brand cream to preserve brand green accents
const isBrandCream = (theme: string) => {
  return !theme || theme === 'default' || theme.toUpperCase() === '#FDFBF7'
}

// Helper for full-width banner text color
const getBannerTextColor = (theme: string) => {
  if (isDarkColor(theme)) return 'text-white'
  return isBrandCream(theme) ? 'text-brand-dark' : 'text-gray-900'
}

const getBannerSubTextColor = (theme: string) => {
  if (isDarkColor(theme)) return 'text-white/80'
  return isBrandCream(theme) ? 'text-brand-dark/80' : 'text-gray-700'
}

const DEFAULT_BANNER = {
  id: 'default-banner',
  title: 'Moments are Sweeter with Flavourite',
  description: 'Chocolates | Baked Goodies | Gift Hampers | Herbal Tea',
  buttonText: 'SHOP NOW',
  buttonLink: '/shop',
  colorTheme: '#FDFBF7',
  image: null,
}

export function HeroBannerCarousel({ banners }: { banners: any[] }) {
  const slides = banners && banners.length > 0 ? banners : [DEFAULT_BANNER]
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)

  const hasMultiple = slides.length > 1

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }, [slides.length])

  // Auto-advance every 5 seconds when there are 2+ banners
  useEffect(() => {
    if (!hasMultiple || isPaused) return
    const timer = setInterval(() => {
      nextSlide()
    }, 5000)
    return () => clearInterval(timer)
  }, [hasMultiple, isPaused, nextSlide])

  // Ensure currentIndex stays in bounds if banners list changes
  const safeIndex = currentIndex >= slides.length ? 0 : currentIndex
  const banner = slides[safeIndex]

  const bannerImageUrl =
    banner?.image && typeof banner.image === 'object' ? banner.image.url : null
  const theme = banner?.colorTheme || 'default'
  const dark = isDarkColor(theme)

  // Touch swipe handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || !hasMultiple) return
    const deltaX = e.changedTouches[0].clientX - touchStartX
    if (Math.abs(deltaX) > 45) {
      if (deltaX < 0) nextSlide()
      else prevSlide()
    }
    setTouchStartX(null)
  }

  return (
    <section
      className="relative py-16 md:py-24 transition-colors duration-700 overflow-hidden select-none"
      style={{ background: getBannerGradient(theme) }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-center gap-12 relative z-10">
        {/* Left: Text Content */}
        <div
          key={`text-${banner?.id || safeIndex}`}
          className="flex-1 text-center md:text-left transition-opacity duration-500"
        >
          <h1
            className={`text-4xl md:text-6xl font-serif italic leading-tight mb-6 ${getBannerTextColor(
              theme
            )}`}
          >
            {banner?.title || 'Moments are Sweeter with Flavourite'}
          </h1>

          <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
            <div
              className={`h-0.5 w-12 ${
                dark
                  ? 'bg-white/30'
                  : isBrandCream(theme)
                  ? 'bg-brand-dark'
                  : 'bg-gray-900/20'
              }`}
            ></div>
            <span className="text-brand-gold text-2xl">✨</span>
            <div
              className={`h-0.5 w-12 ${
                dark
                  ? 'bg-white/30'
                  : isBrandCream(theme)
                  ? 'bg-brand-dark'
                  : 'bg-gray-900/20'
              }`}
            ></div>
          </div>

          <p className={`mb-8 whitespace-pre-line text-base md:text-lg ${getBannerSubTextColor(theme)}`}>
            {banner?.description || 'Chocolates | Baked Goodies | Gift Hampers | Herbal Tea'}
          </p>

          <Link
            href={banner?.buttonLink || '/shop'}
            className={`inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1 ${
              dark
                ? ['dark', '#1e3f20', '#1E3F20'].includes(theme)
                  ? 'bg-white text-brand-dark hover:bg-gray-100'
                  : 'bg-white text-gray-900 hover:bg-gray-100'
                : isBrandCream(theme)
                ? 'bg-brand-dark text-white hover:bg-brand-medium'
                : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            {banner?.buttonText || 'SHOP NOW'} <ArrowRight size={20} />
          </Link>
        </div>

        {/* Right: Banner Image */}
        <div
          key={`img-${banner?.id || safeIndex}`}
          className="flex-1 w-full max-w-md transition-opacity duration-500"
        >
          <div className="aspect-[4/3] rounded-2xl shadow-2xl flex items-center justify-center text-7xl overflow-hidden bg-black/10 border-4 border-white/20">
            {bannerImageUrl ? (
              <img
                src={bannerImageUrl}
                alt={banner?.title || 'Banner'}
                className="w-full h-full object-cover"
              />
            ) : (
              '🛍️'
            )}
          </div>
        </div>
      </div>

      {/* Carousel Controls (Only shown when 2 or more active banners exist) */}
      {hasMultiple && (
        <>
          {/* Left Arrow */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous Banner"
            className={`hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full items-center justify-center transition-all shadow-md ${
              dark
                ? 'bg-white/15 hover:bg-white/30 text-white border border-white/20'
                : 'bg-black/5 hover:bg-black/15 text-gray-800 border border-black/10'
            }`}
          >
            <ChevronLeft size={24} />
          </button>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next Banner"
            className={`hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full items-center justify-center transition-all shadow-md ${
              dark
                ? 'bg-white/15 hover:bg-white/30 text-white border border-white/20'
                : 'bg-black/5 hover:bg-black/15 text-gray-800 border border-black/10'
            }`}
          >
            <ChevronRight size={24} />
          </button>

          {/* Bottom Dots & Mobile Arrows */}
          <div className="mt-10 flex items-center justify-center gap-3 relative z-20">
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous Banner"
              className={`md:hidden p-1.5 rounded-full ${
                dark ? 'text-white/80 hover:text-white' : 'text-gray-700 hover:text-black'
              }`}
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-2">
              {slides.map((slide, idx) => {
                const isActive = idx === safeIndex
                return (
                  <button
                    key={slide.id || idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Go to banner ${idx + 1}`}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      isActive
                        ? dark
                          ? 'w-8 bg-white'
                          : isBrandCream(theme)
                          ? 'w-8 bg-brand-dark'
                          : 'w-8 bg-gray-900'
                        : dark
                        ? 'w-2.5 bg-white/40 hover:bg-white/60'
                        : 'w-2.5 bg-black/20 hover:bg-black/40'
                    }`}
                  />
                )
              })}
            </div>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next Banner"
              className={`md:hidden p-1.5 rounded-full ${
                dark ? 'text-white/80 hover:text-white' : 'text-gray-700 hover:text-black'
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </>
      )}
    </section>
  )
}
