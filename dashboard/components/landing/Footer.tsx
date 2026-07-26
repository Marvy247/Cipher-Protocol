import Link from "next/link"
import { Sparkles } from "lucide-react"

export function Footer() {
  return (
    <footer
      className="border-t border-white/8 py-10 px-8"
      style={{ background: "#0a1e1a" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm tracking-tight text-white">Cipher Protocol</span>
        </Link>

        <div className="flex items-center gap-8 text-xs text-white/30">
          <a href="#layers" className="hover:text-white/60 transition-colors">Layers</a>
          <a href="#features" className="hover:text-white/60 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white/60 transition-colors">How It Works</a>
          <Link href="/login" className="hover:text-white/60 transition-colors">Sign In</Link>
        </div>

        <p className="text-xs text-white/20">
          © {new Date().getFullYear()} Cipher Protocol Protocol
        </p>
      </div>
    </footer>
  )
}