import React from 'react';

/**
 * SkyLoom official logo component
 * Features the signature woven plaid cloud symbol, stylized typography, and orange accent dot.
 */
export const SkyLoomCloudIcon = ({ className = "w-8 h-8", ...props }) => (
  <svg
    viewBox="0 0 120 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <defs>
      {/* Woven diagonal grid pattern matching the SkyLoom brand cloud */}
      <pattern
        id="skyloom-weave"
        patternUnits="userSpaceOnUse"
        width="16"
        height="16"
        patternTransform="rotate(45)"
      >
        <rect width="16" height="16" fill="#0D1B2A" />
        <line x1="0" y1="4" x2="16" y2="4" stroke="#38BDF8" strokeWidth="2.5" />
        <line x1="0" y1="12" x2="16" y2="12" stroke="#38BDF8" strokeWidth="2.5" />
        <line x1="4" y1="0" x2="4" y2="16" stroke="#1E40AF" strokeWidth="2.5" />
        <line x1="12" y1="0" x2="12" y2="16" stroke="#1E40AF" strokeWidth="2.5" />
      </pattern>
    </defs>

    {/* Cloud silhouette filled with the signature weave pattern */}
    <g>
      {/* Left cloud bump */}
      <circle cx="34" cy="52" r="22" fill="url(#skyloom-weave)" />
      {/* Center main cloud dome */}
      <circle cx="58" cy="40" r="28" fill="url(#skyloom-weave)" />
      {/* Right cloud bump */}
      <circle cx="82" cy="54" r="20" fill="url(#skyloom-weave)" />
      {/* Flat bottom base */}
      <rect x="28" y="52" width="66" height="22" rx="4" fill="url(#skyloom-weave)" />

      {/* Cloud outer border outline */}
      <path
        d="M28 72 C14 72 12 52 26 44 C26 22 52 14 64 24 C76 14 96 30 94 48 C106 54 104 72 90 72 Z"
        fill="none"
        stroke="#38BDF8"
        strokeWidth="1.5"
        strokeOpacity="0.4"
      />

      {/* Signature Orange Accent Dot at bottom right */}
      <circle cx="94" cy="68" r="4.5" fill="#F97316" stroke="#0D1B2A" strokeWidth="1" />
    </g>
  </svg>
);

export const SkyLoomLogo = ({ showTagline = false, size = "md" }) => {
  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-14 h-14",
  };

  return (
    <div className="flex items-center gap-2.5 select-none">
      <SkyLoomCloudIcon className={iconSizes[size] || iconSizes.md} />

      <div className="flex flex-col">
        {/* Brand Name: Clean "Sky" in white + "Loom" in bright sky-blue */}
        <div className="flex items-baseline font-black tracking-tight text-xl leading-none">
          <span className="text-white">Sky</span>
          <span className="text-sky-400 font-extrabold -ml-0.5">Loom</span>
        </div>

        {/* Tagline */}
        {showTagline && (
          <span className="text-[9px] font-semibold tracking-[0.2em] text-sky-200/60 uppercase mt-1">
            Weather, Woven Together
          </span>
        )}
      </div>
    </div>
  );
};

export default SkyLoomLogo;
