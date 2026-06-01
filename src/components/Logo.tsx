import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  textColor?: 'dark' | 'white' | 'none';
  showText?: boolean;
}

export default function Logo({
  className = '',
  size = 40,
  textColor = 'dark',
  showText = true,
}: LogoProps) {
  // SVG path definitions that represent:
  // 1. An upper horizontally wide rounded rectangle (T-top bar) with rounded corners
  // 2. A lower rounded square (T-stem) aligned beautifully underneath
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-sm transition-transform hover:scale-105 duration-300"
      >
        {/* Top curved horizontal rectangle */}
        <path
          d="M10 20C10 14.4772 14.4772 10 20 10H80C85.5228 10 90 14.4772 90 20V35C90 43.2843 83.2843 50 75 50H25C16.7157 50 10 43.2843 10 35V20Z"
          fill="url(#tributa-top-gradient)"
        />
        {/* Bottom rounded square element */}
        <rect
          x="20"
          y="56"
          width="36"
          height="36"
          rx="12"
          fill="#7C3AED"
        />
        {/* Gradients */}
        <defs>
          <linearGradient id="tributa-top-gradient" x1="10" y1="10" x2="90" y2="50" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8B5CF6" />
            <stop offset="1" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
      </svg>
      {showText && (
        <span
          className={`font-sans font-bold tracking-tight text-2xl ${
            textColor === 'white' ? 'text-white' : 'text-[#0F172A]'
          }`}
        >
          Tributa
        </span>
      )}
    </div>
  );
}
