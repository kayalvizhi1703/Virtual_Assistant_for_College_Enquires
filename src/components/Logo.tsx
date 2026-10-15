import { motion } from 'framer-motion';

type LogoProps = {
  size?: number;
  className?: string;
};

// Circular "NASC" text badge as the college logo — no images used
export default function Logo({ size = 48, className = '' }: LogoProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      initial={{ rotate: -10, opacity: 0 }}
      animate={{ rotate: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <defs>
        <linearGradient id="nascLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="nascGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
      </defs>
      {/* Outer ring */}
      <circle cx="50" cy="50" r="48" fill="url(#nascLogoGrad)" />
      <circle cx="50" cy="50" r="44" fill="none" stroke="url(#nascGoldGrad)" strokeWidth="2" />
      {/* Circular text path */}
      <defs>
        <path id="circle-text-path" d="M 50 50 m -34 0 a 34 34 0 1 1 68 0 a 34 34 0 1 1 -68 0" />
      </defs>
      <text fontSize="9" fontWeight="700" fill="#fbbf24" letterSpacing="1.5">
        <textPath href="#circle-text-path" startOffset="0%">
          NANDHA ARTS &amp; SCIENCE COLLEGE • ERODE •
        </textPath>
      </text>
      {/* Center monogram */}
      <text x="50" y="58" textAnchor="middle" fontSize="22" fontWeight="700" fill="white">
        NASC
      </text>
    </motion.svg>
  );
}
