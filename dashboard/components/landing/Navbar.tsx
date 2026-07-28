"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { X, Menu } from "lucide-react"
import { Logo } from "@/components/logo"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 sm:px-8 py-4 transition-all duration-500 ${
          scrolled || menuOpen
            ? "bg-[#1a3530]/95 backdrop-blur-md border-b border-white/10"
            : "bg-transparent"
        } ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"}`}
        style={{ transitionProperty: "background-color, border-color, opacity, transform" }}
      >
        <Link href="/" className="flex items-center gap-3 shrink-0 group" onClick={closeMenu}>
          <Logo className="w-9 h-9 group-hover:opacity-80 transition-opacity" />
          <div className="leading-tight">
            <span className="block text-white font-bold text-lg tracking-wide">Cipher</span>
            <span className="block text-white/50 text-[10px] tracking-[0.25em] uppercase font-medium">Protocol</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-white/60">
          {[
            { label: "Home", href: "#home" },
            { label: "Layers", href: "#layers" },
            { label: "Features", href: "#features" },
            { label: "Demo", href: "#how-it-works" },
            { label: "Pitch Deck", href: "https://gamma.app/docs/Cipher-Protocol-bkicpxcsyskfyc9", external: true },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className="hover:text-white transition-colors duration-200 relative group"
            >
              {item.label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-sky-400 group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center shrink-0">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white text-sm font-medium px-5 py-2 rounded-full transition-all duration-200 shadow-lg shadow-sky-500/20"
          >
            Launch Dashboard
          </Link>
        </div>

        <button
          className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col pt-[64px] bg-[#0f2420]/97 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col px-6 py-8 gap-1">
            {[
              { label: "Home", href: "#home" },
              { label: "Layers", href: "#layers" },
              { label: "Features", href: "#features" },
              { label: "Demo", href: "#how-it-works" },
              { label: "Pitch Deck", href: "https://gamma.app/docs/Cipher-Protocol-bkicpxcsyskfyc9", external: true },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                onClick={closeMenu}
                className="py-4 text-xl font-light text-white/80 hover:text-white border-b border-white/8 last:border-0 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="px-6 mt-4 flex flex-col gap-3">
            <Link
              href="/dashboard"
              onClick={closeMenu}
              className="w-full text-center py-3.5 rounded-full bg-sky-500 text-white font-semibold text-sm"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      )}
    </>
  )
}