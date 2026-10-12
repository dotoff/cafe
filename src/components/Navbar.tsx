'use client'
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cart'

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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

  return (
    <>
      {/* Top Bar */}
      <div className="bg-brand-dark text-white text-xs py-2 hidden md:block print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex space-x-2 text-white/80">
            <span>Deliciously Made</span> <span>|</span>
            <span>Lovingly Packed</span> <span>|</span>
            <span>100% Vegetarian ☑️</span>
          </div>
          <div className="flex space-x-4">
            <Link href="/track-order" className="hover:text-white font-medium">📦 Track Order</Link>
            <Link href="/about" className="hover:text-white">About Us</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 print:hidden ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-white py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-3xl transition-transform group-hover:scale-110">🌿</span>
            <div>
              <h1 className="text-2xl font-serif font-bold text-brand-dark leading-none m-0 p-0">Flavourite</h1>
              <span className="text-[0.6rem] uppercase tracking-widest text-brand-dark font-sans block mt-1">Food & Beverage</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="font-medium hover:text-brand-dark transition-colors">Home</Link>
            <Link href="/shop" className="font-medium hover:text-brand-dark transition-colors">Shop</Link>
            <Link href="/shop?category=chocolates" className="font-medium hover:text-brand-dark transition-colors">Chocolates</Link>
            <Link href="/shop?category=hampers" className="font-medium hover:text-brand-dark transition-colors">Hampers</Link>
            <Link href="/track-order" className="font-medium text-brand-dark hover:text-brand-medium transition-colors">Track Order</Link>
          </div>

          <div className="flex items-center space-x-5">
            <button className="text-gray-600 hover:text-brand-dark transition-colors"><Search size={20} /></button>
            <button className="text-gray-600 hover:text-brand-dark transition-colors hidden sm:block"><User size={20} /></button>
            <Link href="/cart" className="text-gray-600 hover:text-brand-dark transition-colors relative">
              <ShoppingCart size={20} />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-purple text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <button className="md:hidden text-gray-600" onClick={() => setMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-white overflow-y-auto">
          <div className="p-4 flex justify-between items-center border-b">
            <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
              <span className="text-2xl">🌿</span>
              <h1 className="text-xl font-serif font-bold text-brand-dark">Flavourite</h1>
            </Link>
            <button onClick={() => setMobileMenuOpen(false)}><X size={28} /></button>
          </div>
          <div className="flex flex-col p-6 space-y-6 text-lg">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link href="/shop" onClick={() => setMobileMenuOpen(false)}>Shop All</Link>
            <Link href="/shop?category=chocolates" onClick={() => setMobileMenuOpen(false)}>Chocolates</Link>
            <Link href="/shop?category=hampers" onClick={() => setMobileMenuOpen(false)}>Gift Hampers</Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
          </div>
        </div>
      )}
    </>
  )
}
