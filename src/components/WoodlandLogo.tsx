import React from "react";

interface WoodlandLogoProps {
  className?: string;
  variant?: "full" | "shield-only" | "clean-white";
  size?: number | string;
  themeColor?: string; // Overrides secondary colors if requested
}

export default function WoodlandLogo({
  className = "",
  variant = "full",
  size = "100%",
  themeColor = "",
}: WoodlandLogoProps) {
  // Let's create an elegant, scalable SVG for Woodland Overseas School
  // This matches the logo uploaded by the user with shield, ribbon, and brand name.

  const textPrimary = variant === "clean-white" ? "#FFFFFF" : "#0D5676";
  const textSecondary = variant === "clean-white" ? "rgba(255,255,255,0.8)" : "#0E3E5B";
  const ribbonBg = variant === "clean-white" ? "#0A3D54" : "#1B4D3E";
  const goldStroke = "#D4AF37";

  return (
    <div
      id="woodland-school-logo-container"
      className={`flex flex-col items-center justify-center text-center transition-all duration-300 ${className}`}
      style={{ width: size, maxWidth: "100%" }}
    >
      <svg
        id="woodland-crest-svg"
        viewBox="0 0 400 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        style={{ maxHeight: "100%" }}
      >
        {/* SHIELD BODY */}
        {/* Outer Shield Border */}
        <path
          d="M200,34 C280,34 320,44 320,44 C320,44 324,200 200,266 C76,200 80,44 80,44 C80,44 120,34 200,34 Z"
          fill={variant === "clean-white" ? "rgba(255,255,255,0.15)" : "#E4F3EF"}
          stroke={variant === "clean-white" ? "#FFFFFF" : "#1B4D3E"}
          strokeWidth="6"
          strokeLinejoin="round"
        />

        {/* Inner Gold Shield Border Accent */}
        <path
          d="M200,42 C272,42 308,51 308,51 C308,51 311,192 200,252 C89,192 92,51 92,51 C92,51 128,42 200,42 Z"
          stroke={goldStroke}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Dynamic Flame / Wings (Abstract flora inside) */}
        {/* Left tall wing */}
        <path
          d="M190,72 C190,72 165,115 168,160 C171,200 196,215 196,215 C196,215 178,200 178,170 C178,135 194,103 194,103 Z"
          fill={variant === "clean-white" ? "#FFFFFF" : "#143D2A"}
        />
        {/* Center taller wing */}
        <path
          d="M200,58 C200,58 178,110 182,165 C186,210 205,225 205,225 C205,225 192,208 191,173 C190,135 205,98 205,98 Z"
          fill={variant === "clean-white" ? "#FFFFFF" : "#1A4D32"}
        />
        {/* Right curved wing/block */}
        <path
          d="M207,112 C204,112 215,112 232,112 C232,112 232,165 232,175 C232,185 220,185 210,185 C205,185 205,170 205,170 C205,170 216,170 220,170 C223,170 223,125 215,125 C211,125 207,112 207,112 Z"
          fill={variant === "clean-white" ? "#FFFFFF" : "#1B4D3E"}
        />

        {/* BOOK SECTIONS AT BASE OF SHIELD */}
        <g id="academic-book" transform="translate(165, 212)">
          {/* Cover */}
          <path d="M0,8 C12,12 30,12 35,5 C40,12 58,12 70,8 L70,12 C58,16 40,16 35,9 C30,16 12,16 0,12 Z" fill="#D4AF37" />
          {/* Pages block */}
          <path d="M1,6 C12,10 30,10 35,3 C40,10 58,10 69,6 L69,10 C58,14 40,14 35,7 C30,14 12,14 1,10 Z" fill="#FFFFFF" stroke="#000000" strokeWidth="0.5" />
          <path d="M2,3 C12,7 30,7 35,0 C40,7 58,7 68,3 L68,7 C58,11 40,11 35,4 C30,11 12,11 2,7 Z" fill="#EAECEE" stroke="#000000" strokeWidth="0.5" />
        </g>

        {variant !== "shield-only" && (
          <>
            {/* CARPE DIEM SCROLL RIBBON */}
            <g id="ribbon-banner">
              {/* Ribbon outer background tails */}
              <path
                d="M50,230 C40,245 42,260 50,270 L70,270 C65,255 60,240 70,230 Z"
                fill={variant === "clean-white" ? "rgba(255,255,255,0.4)" : "#133C29"}
              />
              <path
                d="M350,230 C360,245 358,260 350,270 L330,270 C335,255 340,240 330,230 Z"
                fill={variant === "clean-white" ? "rgba(255,255,255,0.4)" : "#133C29"}
              />

              {/* Main Ribbon Body */}
              <path
                d="M50,250 C120,225 280,225 350,250 C368,272 350,296 320,292 C260,275 140,275 80,292 C52,296 32,272 50,250 Z"
                fill={ribbonBg}
                stroke={goldStroke}
                strokeWidth="3.5"
                strokeLinejoin="round"
              />

              {/* Ribbon Gold Fold Accents */}
              <path d="M72,246 C120,234 280,234 328,246" stroke={goldStroke} strokeWidth="1.5" />
              <path d="M75,284 C120,270 280,270 325,284" stroke={goldStroke} strokeWidth="1.5" />

              {/* Stars inside ribbon */}
              {/* Left group stars */}
              <polygon points="65,268 67,264 71,264 68,261 69,257 65,259 61,257 62,261 59,264 63,264" fill={goldStroke} />
              <polygon points="80,264 82,260 86,260 83,257 84,253 80,255 76,253 77,257 74,260 78,260" fill={goldStroke} />
              <polygon points="95,261 97,257 101,257 98,254 99,250 95,252 91,250 92,254 89,257 93,257" fill={goldStroke} />
              <polygon points="110,258 112,254 116,254 113,251 114,247 110,249 106,247 107,251 104,254 108,254" fill={goldStroke} />

              {/* Right group stars */}
              <polygon points="290,258 292,254 296,254 293,251 294,247 290,249 286,247 287,251 284,254 288,254" fill={goldStroke} />
              <polygon points="305,261 307,257 311,257 308,254 309,250 305,252 301,250 302,254 299,257 303,257" fill={goldStroke} />
              <polygon points="320,264 322,260 326,260 323,257 324,253 320,255 316,253 317,257 314,260 318,260" fill={goldStroke} />
              <polygon points="335,268 337,264 341,264 338,261 339,257 335,259 331,257 332,261 329,264 333,264" fill={goldStroke} />

              {/* Ribbon Text "CARPE DIEM" */}
              <text
                x="200"
                y="266"
                fill="#FFFFFF"
                fontFamily="Georgia, serif"
                fontSize="18"
                fontWeight="900"
                letterSpacing="4"
                textAnchor="middle"
                style={{ textShadow: "0px 1.5px 2px rgba(0,0,0,0.4)" }}
              >
                CARPE DIEM
              </text>
            </g>
          </>
        )}
      </svg>

      {/* WOODLAND OVERSEAS SCHOOL TEXT BRANDING */}
      {variant === "full" && (
        <div id="woodland-text-branding-group" className="mt-2 text-center select-none">
          <h2
            id="woodland-brand-title"
            className="tracking-widest font-bold uppercase transition-colors duration-300"
            style={{
              color: textPrimary,
              fontFamily: "Georgia, serif",
              fontSize: "1.95rem",
              lineHeight: "1.1",
              letterSpacing: "0.15em"
            }}
          >
            Woodland
          </h2>
          <p
            id="woodland-brand-subtitle"
            className="mt-1 text-sm font-semibold tracking-widest uppercase opacity-90 transition-colors duration-300"
            style={{
              color: textSecondary,
              fontFamily: "Georgia, serif",
              fontSize: "0.78rem",
              letterSpacing: "0.22em"
            }}
          >
            Overseas School
          </p>
        </div>
      )}
    </div>
  );
}
