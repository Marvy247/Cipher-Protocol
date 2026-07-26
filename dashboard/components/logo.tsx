export function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer hexagon shield */}
      <path
        d="M20 2L35 10.5V22.5C35 30.5 28.5 37 20 38.5C11.5 37 5 30.5 5 22.5V10.5L20 2Z"
        className="stroke-white/90"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Inner hexagon */}
      <path
        d="M20 7L30.5 12.8V21.2C30.5 26.8 26 31.5 20 32.5C14 31.5 9.5 26.8 9.5 21.2V12.8L20 7Z"
        className="fill-white/10 stroke-white/60"
        strokeWidth="1"
      />
      {/* Stylized C cipher - outer arc */}
      <path
        d="M16 14C16 14 14.5 16 14.5 20C14.5 24 16 26 16 26"
        className="stroke-white"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Stylized C cipher - inner arc */}
      <path
        d="M24 14C24 14 25.5 16 25.5 20C25.5 24 24 26 24 26"
        className="stroke-white"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Decorative dots */}
      <circle cx="16" cy="14" r="1" className="fill-white" />
      <circle cx="16" cy="26" r="1" className="fill-white" />
      <circle cx="24" cy="14" r="1" className="fill-white" />
      <circle cx="24" cy="26" r="1" className="fill-white" />
      {/* Center keyline */}
      <line x1="20" y1="15" x2="20" y2="25" className="stroke-white/40" strokeWidth="0.5" />
      {/* Bottom accent line */}
      <path
        d="M14 31L20 34L26 31"
        className="stroke-white/70"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

export function LogoFull({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M16 1L29 8.5V19C29 26 23 31.5 16 32.5C9 31.5 3 26 3 19V8.5L16 1Z"
        className="stroke-white/90"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M16 5.5L24.5 10V17.5C24.5 22 20.8 26 16 26.8C11.2 26 7.5 22 7.5 17.5V10L16 5.5Z"
        className="fill-white/8 stroke-white/60"
        strokeWidth="0.8"
      />
      <path
        d="M12.5 12C12.5 12 11.2 13.5 11.2 16.5C11.2 19.5 12.5 21 12.5 21"
        className="stroke-white"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M19.5 12C19.5 12 20.8 13.5 20.8 16.5C20.8 19.5 19.5 21 19.5 21"
        className="stroke-white"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <line x1="16" y1="12.5" x2="16" y2="20.5" className="stroke-white/40" strokeWidth="0.5" />
      <path
        d="M11 25.5L16 28L21 25.5"
        className="stroke-white/70"
        strokeWidth="0.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}
