'use client'

import { ShoppingCart, User, Search, Menu, X, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cart'
import { useRouter } from 'next/navigation'

interface NavLinkItem {
  label: string
  link: string
  isActive?: boolean
  badge?: string
}

interface NavbarProps {
  settings?: any
  categories?: any[]
}

export function Navbar({ settings, categories = [] }: NavbarProps) {
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const itemCount = useCartStore((state) => state.getItemCount())
  
  // Hydration fix for zustand persist
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Build the navigation links: CMS customized headerNav OR intelligent fallback
  const customNav: NavLinkItem[] = (settings?.headerNav || []).filter(
    (item: NavLinkItem) => item && item.isActive !== false && item.label && item.link
  )

  const defaultCategoryLinks: NavLinkItem[] = categories.length > 0
    ? categories.slice(0, 3).map((cat: any) => ({
        label: cat.title,
        link: `/shop?category=${cat.slug}`,
      }))
    : [
        { label: 'Chocolates', link: '/shop?category=chocolates' },
        { label: 'Hampers', link: '/shop?category=hampers' },
      ]

  const navLinks: NavLinkItem[] = customNav.length > 0 
    ? customNav 
    : [
        { label: 'Home', link: '/' },
        { label: 'Shop All', link: '/shop' },
        ...defaultCategoryLinks,
        { label: 'Track Order', link: '/track-order' },
      ]

  const announcementText = settings?.announcementBarActive && settings?.announcementBarText
    ? settings.announcementBarText
    : '🌿 100% Vegetarian Artisanal Goodies • Made with Love in Samalkot • Pan-India Courier Available'

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-brand-dark text-white text-xs py-2 hidden md:block print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-white/90 font-medium">
            <span>{announcementText}</span>
          </div>
          <div className="flex space-x-4 text-white/80">
            <Link href="/track-order" className="hover:text-white transition-colors">📦 Track Order</Link>
            <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 print:hidden ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-3' : 'bg-white py-4 sm:py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="text-3xl transition-transform group-hover:scale-110">🌿</span>
            <div>
              <h1 className="text-2xl font-serif font-bold text-brand-dark leading-none m-0 p-0">
                {settings?.storeName || 'Flavourite'}
              </h1>
              <span className="text-[0.62rem] uppercase tracking-widest text-brand-dark/80 font-sans block mt-1 font-semibold">
                Food & Beverage
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (CMS Powered) */}
          <div className="hidden md:flex items-center space-x-7">
            {navLinks.map((item, idx) => (
              <Link 
                key={`${item.link}-${idx}`} 
                href={item.link} 
                className="font-medium text-gray-700 hover:text-brand-dark transition-colors inline-flex items-center text-[0.95rem]"
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-1.5 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-4 sm:space-x-5">
            {/* Search Trigger */}
            <button 
              onClick={() => setSearchOpen(!searchOpen)} 
              aria-label="Search store"
              className="text-gray-600 hover:text-brand-dark transition-colors p-1"
            >
              <Search size={20} />
            </button>

            {/* Customer Account */}
            <Link 
              href="/account" 
              aria-label="Customer Account"
              className="text-gray-600 hover:text-brand-dark transition-colors p-1 hidden sm:block"
            >
              <User size={20} />
            </Link>

            {/* Shopping Cart */}
            <Link 
              href="/cart" 
              aria-label="Shopping Cart"
              className="text-gray-600 hover:text-brand-dark transition-colors relative p-1"
            >
              <ShoppingCart size={20} />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-brand-dark text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Hamburger */}
            <button 
              className="md:hidden text-gray-700 p-1" 
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open mobile menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Expandable Search Input */}
        {searchOpen && (
          <div className="max-w-7xl mx-auto px-4 pt-3 pb-2 border-t border-gray-100 mt-3 animate-fadeIn">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search size={18} className="absolute left-3 text-gray-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search brownies, chocolates, hampers, gift boxes..." 
                className="w-full bg-gray-50 border border-gray-200 rounded-full pl-10 pr-24 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark/20 focus:border-brand-dark"
                autoFocus
              />
              <button 
                type="submit" 
                className="absolute right-1.5 bg-brand-dark text-white text-xs font-semibold px-4 py-1.5 rounded-full hover:bg-brand-medium transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col overflow-y-auto animate-fadeIn">
          <div className="p-4 flex justify-between items-center border-b">
            <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
              <span className="text-2xl">🌿</span>
              <h1 className="text-xl font-serif font-bold text-brand-dark">
                {settings?.storeName || 'Flavourite'}
              </h1>
            </Link>
            <button 
              onClick={() => setMobileMenuOpen(false)} 
              className="p-1 text-gray-600 hover:text-black"
              aria-label="Close menu"
            >
              <X size={26} />
            </button>
          </div>

          <div className="flex flex-col p-6 space-y-4 text-base font-medium text-gray-800">
            {navLinks.map((item, idx) => (
              <Link 
                key={`mobile-${item.link}-${idx}`}
                href={item.link} 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2 border-b border-gray-50"
              >
                <div className="flex items-center gap-2">
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      {item.badge}
                    </span>
                  )}
                </div>
                <ArrowRight size={16} className="text-gray-400" />
              </Link>
            ))}

            <div className="pt-4 space-y-3 text-sm text-gray-600 border-t border-gray-100">
              <Link 
                href="/account" 
                onClick={() => setMobileMenuOpen(false)} 
                className="flex items-center gap-2.5 py-1 text-brand-dark font-semibold"
              >
                <User size={18} />
                <span>My Account & Saved Addresses</span>
              </Link>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block py-1">
                About Flavourite Bakery
              </Link>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block py-1">
                Contact & Custom Orders
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
