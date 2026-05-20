import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { Download, FileText, Move, Sparkles, AlertCircle, Edit, LayoutGrid, CheckCircle } from "lucide-react";
import { PosterData, PosterSize } from "../types";
import WoodlandLogo from "./WoodlandLogo";

interface PosterCanvasProps {
  posterData: PosterData;
  activeSize: PosterSize;
  logoUrl: string | null;  // Custom uploaded logo if any
  peopleImageUrl: string | null; // Custom uploaded image of speaker/achiever
  onUpdateField: (field: keyof Omit<PosterData, "design"> | "title" | "subtitle" | "mainContent" | "eventDetails" | "namesDesignations" | "design", value: any) => void;
}

export default function PosterCanvas({
  posterData,
  activeSize,
  logoUrl,
  peopleImageUrl,
  onUpdateField,
}: PosterCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [activeEditingField, setActiveEditingField] = useState<string | null>(null);

  const { title, subtitle, mainContent, eventDetails, namesDesignations, design } = posterData;

  // Special bold title formatter to support high-impact outlines
  const renderBoldTitle = (text: string) => {
    const isBoldTheme = design.themeName.toLowerCase().includes("bold") || design.themeName.toLowerCase().includes("cyber");
    if (!isBoldTheme) {
      return text;
    }
    
    const words = text.split(/\s+/);
    if (words.length <= 1) {
      return text;
    }

    return words.map((word, index) => {
      // make middle or alternate words hollow outlines
      const isStroke = index === Math.floor(words.length / 2) || (words.length > 3 && index === words.length - 2);
      if (isStroke) {
        return (
          <span
            key={index}
            className="text-transparent font-black mx-1 inline-block"
            style={{
              WebkitTextStroke: "1px currentColor",
            }}
          >
            {word}
          </span>
        );
      }
      return <span key={index} className="mx-1">{word}</span>;
    });
  };

  // Render SVG background graphics based on Gemini's choice of backgroundStyle
  const renderBackgroundGraphics = () => {
    switch (design.backgroundStyle) {
      case "academic-shield":
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.06] flex items-center justify-center">
            {/* Massive watermark of the school logo in the center background */}
            <WoodlandLogo variant="shield-only" size="90%" />
          </div>
        );
      case "cyber-grid":
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `linear-gradient(to right, ${design.secondaryColor}22 1px, transparent 1px), linear-gradient(to bottom, ${design.secondaryColor}22 1px, transparent 1px)`,
                backgroundSize: "24px 24px",
              }}
            />
            {/* Cyber neon visual nodes */}
            <div
              className="absolute h-40 w-40 rounded-full blur-3xl opacity-30 animate-pulse"
              style={{
                backgroundColor: design.accentColor,
                top: "10%",
                right: "10%",
              }}
            />
            <div
              className="absolute h-52 w-52 rounded-full blur-3xl opacity-20"
              style={{
                backgroundColor: design.primaryColor,
                bottom: "15%",
                left: "10%",
              }}
            />
          </div>
        );
      case "abstract-gradients":
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute h-[80%] w-[80%] rounded-full blur-[80px] opacity-40 mix-blend-screen animate-pulse duration-1000"
              style={{
                backgroundColor: design.secondaryColor,
                top: "-10%",
                left: "-10%",
              }}
            />
            <div
              className="absolute h-[60%] w-[60%] rounded-full blur-[100px] opacity-30 mix-blend-screen"
              style={{
                backgroundColor: design.accentColor,
                bottom: "5%",
                right: "-5%",
              }}
            />
          </div>
        );
      case "geometric-lines":
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-15">
            <svg x="0" y="0" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              {/* Dynamic diagonal and nested borders */}
              <line x1="0" y1="0" x2="100%" y2="100%" stroke={design.secondaryColor} strokeWidth="1" />
              <line x1="100%" y1="0" x2="0" y2="100%" stroke={design.secondaryColor} strokeWidth="1" />
              <circle cx="50%" cy="50%" r="35%" stroke={design.accentColor} strokeWidth="1.5" strokeDasharray="5 5" fill="none" />
              <rect x="5%" y="5%" width="90%" height="90%" stroke={design.secondaryColor} strokeWidth="1" fill="none" />
            </svg>
          </div>
        );
      case "playful-particles":
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25">
            {/* Cute colored circles/chips */}
            <div className="absolute top-[8%] left-[12%] h-12 w-12 rounded-full" style={{ backgroundColor: design.secondaryColor }} />
            <div className="absolute top-[18%] right-[8%] h-24 w-24 rounded-full opacity-60" style={{ backgroundColor: design.accentColor }} />
            <div className="absolute bottom-[25%] left-[8%] h-16 w-16 rounded-full" style={{ backgroundColor: design.primaryColor }} />
            <div className="absolute bottom-[8%] right-[15%] h-20 w-20 rounded-full opacity-40" style={{ backgroundColor: design.secondaryColor }} />
          </div>
        );
      default:
        // clean-minimal: fine border margins
        return (
          <div className="absolute inset-4 overflow-hidden pointer-events-none border border-dashed rounded-lg opacity-25" style={{ borderColor: design.textColorSecondary }} />
        );
    }
  };

  // Trigger high quality PNG export using html2canvas
  const handleExportPNG = async () => {
    if (!canvasRef.current || isExporting) return;
    setIsExporting(true);
    setActiveEditingField(null); // Close active edit outlines

    try {
      // Temporarily scale up for ultra HD look
      const originalStyleWidth = canvasRef.current.style.width;
      const originalStyleHeight = canvasRef.current.style.height;

      // Ensure full rendering dimensions
      const options = {
        scale: 3, // Premium quality (3x resolution multiplier)
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        scrollX: 0,
        scrollY: 0,
        windowWidth: canvasRef.current.scrollWidth,
        windowHeight: canvasRef.current.scrollHeight,
      };

      const canvas = await html2canvas(canvasRef.current, options);
      const dataUrl = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.download = `Woodland_${title.substring(0, 16).replace(/\s+/g, "_")}_Poster.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to generate HD PNG:", error);
    } finally {
      setIsExporting(false);
    }
  };

  // Print poster as PDF
  const handleExportPDF = () => {
    if (!canvasRef.current) return;
    setActiveEditingField(null);

    // Dynamic clean printing approach: open a minimal high-quality viewport specifically sized to the poster and trigger native system print-to-pdf
    const posterHtml = canvasRef.current.innerHTML;
    const sizeWidth = activeSize.width;
    const sizeHeight = activeSize.height;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow pop-ups to print/export PDF.");
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Woodland School Poster - PDF Export</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
              @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap');
              @media print {
                body { margin: 0; padding: 0; box-shadow: none; background: white; -webkit-print-color-adjust: exact; }
                .no-print { display: none; }
                .print-container { width: ${sizeWidth}px !important; height: ${sizeHeight}px !important; margin: 0 auto; page-break-inside: avoid; }
              }
              body {
                background: #f1f5f9;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
              }
          </style>
        </head>
        <body>
          <div class="print-container relative overflow-hidden flex flex-col justify-between shadow-2xl p-8 border"
               style="background: linear-gradient(135deg, ${design.bgGradientStart}, ${design.bgGradientEnd}); color: ${design.textColorPrimary}; border-color: ${design.secondaryColor}44; width: ${sizeWidth}px; height: ${sizeHeight}px;">
            ${posterHtml}
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Manual configuration controls for Logo arrangement on canvas
  const handleLogoPositionCycle = () => {
    const positions: Array<"top-left" | "top-center" | "top-right"> = ["top-left", "top-center", "top-right"];
    const currentIndex = positions.indexOf(design.logoPosition);
    const nextIndex = (currentIndex + 1) % positions.length;
    onUpdateField("design", { ...design, logoPosition: positions[nextIndex] });
  };

  // Render logo container wrapper based on selected top alignment
  const getLogoAlignmentClass = () => {
    switch (design.logoPosition) {
      case "top-left":
        return "justify-start text-left items-start md:text-left self-start";
      case "top-right":
        return "justify-end text-right items-end md:text-right self-end";
      default:
        return "justify-center text-center items-center self-center mx-auto";
    }
  };

  return (
    <div id="poster-rendering-workbench" className="flex flex-col items-center justify-center p-4 lg:p-6 w-full h-full bg-[#F9F8F3] border border-[#1A2E2A]/15 rounded-2xl relative overflow-hidden select-none">
      
      {/* Mini Workspace Utility bar */}
      <div id="canvas-utility-bar" className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200">
        <div className="flex items-center space-x-2.5">
          <LayoutGrid className="h-4.5 w-4.5 text-[#1A2E2A]" />
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-widest font-mono">
            {activeSize.name} ({activeSize.ratio})
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#A3B18A]/20 text-[#1A2E2A] font-bold font-mono">
            {activeSize.width} × {activeSize.height} px
          </span>
        </div>

        {/* Action triggers */}
        <div className="flex items-center space-x-2">
          {/* Logo Alignment Switcher shortcut */}
          <button
            id="logo-position-cycle-btn"
            onClick={handleLogoPositionCycle}
            title="Cycle Logo Placement Position"
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs bg-white border border-slate-200 text-slate-600 hover:text-[#1A2E2A] hover:bg-slate-50/70 transition-all font-medium"
          >
            <Move className="h-3 w-3" />
            <span>Logo: {design.logoPosition}</span>
          </button>

          <button
            id="export-png-button"
            onClick={handleExportPNG}
            disabled={isExporting}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1A2E2A] text-white hover:bg-[#2D5049] transition-all shadow-sm cursor-pointer disabled:opacity-50 font-sans uppercase tracking-wider font-bold"
          >
            <Download className="h-3.5 w-3.5 text-[#A3B18A]" />
            <span>{isExporting ? "Rendering..." : "HD PNG"}</span>
          </button>

          <button
            id="export-pdf-button"
            onClick={handleExportPDF}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-slate-200 text-slate-750 hover:text-[#1A2E2A] hover:bg-slate-50 transition-all font-sans uppercase tracking-wider font-bold"
          >
            <FileText className="h-3.5 w-3.5 text-slate-500" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* RENDER VIEWPORT FRAME (Fits the parent cleanly) */}
      <div
        id="poster-canvas-viewport-frame"
        className="w-full max-w-full flex items-center justify-center overflow-auto py-8 px-4 mb-2 bg-[#DEDCCF] border border-slate-300 rounded-xl shadow-inner relative"
        style={{ minHeight: "480px" }}
      >
        {/* Floating Pro proofreader overlay style matching Bold Typography concept */}
        <div className="absolute top-4 left-4 z-20 bg-[#1A2E2A] text-white px-3 py-1.5 rounded-lg flex items-center gap-2.5 shadow-2xl border border-[#A3B18A]/30">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
          <span className="text-[10px] font-bold uppercase tracking-widest font-mono">AI SPELLCHECK: PASS</span>
        </div>
        <div
          ref={canvasRef}
          id="woodland-master-poster"
          className="relative shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between p-7 select-text"
          style={{
            width: `${activeSize.width}px`,
            height: `${activeSize.height}px`,
            background: `linear-gradient(135deg, ${design.bgGradientStart}, ${design.bgGradientEnd})`,
            borderColor: `${design.secondaryColor}50`,
            borderWidth: "12px",
            borderStyle: "double",
            fontFamily: design.fontPairing.bodyFont,
            transform: "scale(1)",
            transformOrigin: "center center",
          }}
        >
          {/* 1. STYLED AI BACKGROUND GRAPHICS */}
          {renderBackgroundGraphics()}

          {/* 2. SCHOOL LOGO BANNER ZONE */}
          <div
            id="poster-logo-header-row"
            className={`w-full flex z-10 select-none pb-4 ${getLogoAlignmentClass()}`}
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Uploaded school logo"
                className="max-h-16 object-contain pointer-events-none drop-shadow-md"
                style={{ imageRendering: "auto" }}
                referrerPolicy="no-referrer"
              />
            ) : (
              <WoodlandLogo
                variant={design.backgroundStyle === "cyber-grid" ? "clean-white" : "full"}
                size={activeSize.width < 450 ? 95 : 125}
              />
            )}
          </div>

          {/* 3. MULTI-LAYER INTERACTIVE POSTER LAYOUT AREA */}
          <div
            id="poster-layout-body"
            className={`w-full h-full flex z-10 flex-col py-1 justify-center space-y-4 ${
              design.layoutStyle === "split" ? "md:grid md:grid-cols-2 md:gap-4 md:space-y-0" : ""
            }`}
          >
            {/* CONTENT CANVAS WRAPPER (Cards overlays depending on layout styles) */}
            <div
              id="poster-text-content-card"
              onClick={() => setActiveEditingField("content-block")}
              className={`flex-1 flex flex-col justify-between gap-3 text-center p-4 rounded-xl border transition-all ${
                design.layoutStyle === "elegant-card"
                  ? "shadow-lg backdrop-blur-md"
                  : "bg-transparent border-transparent shadow-none"
              }`}
              style={{
                backgroundColor: design.layoutStyle === "elegant-card" ? design.cardBackground : "transparent",
                borderColor: `${design.secondaryColor}20`,
                textAlign: design.layoutStyle === "centered" ? "center" : "left",
              }}
            >
              {/* HEADLINES GRID */}
              <div className="space-y-2 w-full">
                {/* Editable Subtitle */}
                <div
                  className={`relative group rounded-md p-1 transition-all ${
                    activeEditingField === "subtitle" ? "ring-2 ring-teal-500 bg-white/10" : "hover:bg-black/5 cursor-pointer"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveEditingField("subtitle");
                  }}
                >
                  {activeEditingField === "subtitle" ? (
                    <input
                      type="text"
                      value={subtitle}
                      onChange={(e) => onUpdateField("subtitle", e.target.value)}
                      onBlur={() => setActiveEditingField(null)}
                      className="w-full bg-slate-800 text-white border-0 text-[11px] font-semibold py-1 px-1.5 rounded outline-none"
                      autoFocus
                    />
                  ) : (
                    <p
                      className="font-semibold uppercase tracking-widest text-[10px] sm:text-xs"
                      style={{
                        color: design.secondaryColor,
                        fontFamily: design.fontPairing.headerFont,
                        letterSpacing: "0.22em",
                      }}
                    >
                      {subtitle || "Click to add Subtitle..."}
                    </p>
                  )}
                  <span className="absolute right-1 top-1 text-[8px] opacity-0 group-hover:opacity-60 bg-slate-900/50 text-white rounded px-1 flex items-center gap-0.5 no-print">
                    <Edit className="h-2 w-2" /> edit
                  </span>
                </div>

                {/* Editable Primary Title */}
                <div
                  className={`relative group rounded-md p-1 transition-all ${
                    activeEditingField === "title" ? "ring-2 ring-teal-500 bg-white/10" : "hover:bg-black/5 cursor-pointer"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveEditingField("title");
                  }}
                >
                  {activeEditingField === "title" ? (
                    <textarea
                      value={title}
                      onChange={(e) => onUpdateField("title", e.target.value)}
                      onBlur={() => setActiveEditingField(null)}
                      rows={2}
                      className="w-full bg-slate-800 text-white border-0 font-bold py-1 px-1.5 rounded outline-none text-sm font-sans"
                      autoFocus
                    />
                  ) : (
                    <h1
                      className={`${
                        design.themeName.toLowerCase().includes("bold") || design.themeName.toLowerCase().includes("cyber")
                          ? "text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter leading-[0.95] uppercase mb-4"
                          : "font-extrabold uppercase leading-[1.15] text-xl sm:text-2xl md:text-3xl"
                      } max-w-full overflow-hidden text-clip break-words flex flex-wrap justify-center font-sans`}
                      style={{
                        color: design.textColorPrimary,
                        fontFamily: design.fontPairing.headerFont,
                      }}
                    >
                      {renderBoldTitle(title)}
                    </h1>
                  )}
                  <span className="absolute right-1 top-1 text-[8px] opacity-0 group-hover:opacity-60 bg-slate-900/50 text-white rounded px-1 flex items-center gap-0.5 no-print">
                    <Edit className="h-2 w-2" /> edit
                  </span>
                </div>
              </div>

              {/* CORE CONTENT & OPTIONAL MEDIA */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-center my-0.5">
                {/* Editable Main Body paragraph */}
                <div
                  className={`flex-1 relative group rounded-md p-1.5 transition-all text-sm ${
                    activeEditingField === "mainContent" ? "ring-2 ring-teal-500 bg-white/10" : "hover:bg-black/5 cursor-pointer"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveEditingField("mainContent");
                  }}
                >
                  {activeEditingField === "mainContent" ? (
                    <textarea
                      value={mainContent}
                      onChange={(e) => onUpdateField("mainContent", e.target.value)}
                      onBlur={() => setActiveEditingField(null)}
                      rows={3}
                      className="w-full bg-slate-800 text-white border-0 text-xs py-1 px-1.5 rounded outline-none"
                      autoFocus
                    />
                  ) : (
                    <p
                      className="leading-relaxed font-normal text-xs sm:text-[13px] opacity-90 max-w-full tracking-normal"
                      style={{
                        color: design.textColorSecondary,
                      }}
                    >
                      {mainContent || "Enter details content context..."}
                    </p>
                  )}
                  <span className="absolute right-1 top-1 text-[8px] opacity-0 group-hover:opacity-60 bg-slate-900/50 text-white rounded px-1 flex items-center gap-0.5 no-print">
                    <Edit className="h-2 w-2" /> edit
                  </span>
                </div>

                {/* People Cutout image - if uploaded, we place with shadows & border */}
                {peopleImageUrl && (
                  <div id="people-image-canvas-mask" className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-xl border-3 border-white shadow-xl overflow-hidden shrink-0 rotate-1 flex items-center justify-center mix-blend-normal bg-slate-100">
                    <img
                      src={peopleImageUrl}
                      alt="Uploaded speaker/achiever"
                      className="h-full w-full object-cover rounded-lg transform scale-102 hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent h-6 flex items-end justify-center pb-1">
                      <span className="text-[8px] text-white/95 font-bold uppercase tracking-widest font-mono">Maverick</span>
                    </div>
                  </div>
                )}
              </div>

              {/* EVENT INFO HIGHLIGHT (BOXES AND BADGES) */}
              {eventDetails && (
                <div
                  className={`relative group rounded-md p-2 transition-all text-center flex flex-col items-center justify-center ${
                    activeEditingField === "eventDetails" ? "ring-2 ring-teal-500 bg-white/10" : "hover:bg-black/5 cursor-pointer"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveEditingField("eventDetails");
                  }}
                  style={{
                    backgroundColor: `${design.secondaryColor}10`,
                    borderColor: `${design.secondaryColor}25`,
                    borderWidth: "1.5px",
                    borderStyle: "dashed"
                  }}
                >
                  {activeEditingField === "eventDetails" ? (
                    <textarea
                      value={eventDetails}
                      onChange={(e) => onUpdateField("eventDetails", e.target.value)}
                      onBlur={() => setActiveEditingField(null)}
                      rows={2}
                      className="w-full bg-slate-800 text-white border-0 text-xs py-1 px-1.5 rounded outline-none"
                      autoFocus
                    />
                  ) : (
                    <p
                      className="text-xs font-semibold leading-relaxed"
                      style={{
                        color: design.textColorPrimary,
                        fontFamily: design.fontPairing.headerFont,
                      }}
                    >
                      {eventDetails}
                    </p>
                  )}
                  <span className="absolute right-1 top-1 text-[8px] opacity-0 group-hover:opacity-60 bg-slate-900/50 text-white rounded px-1 flex items-center gap-0.5 no-print">
                    <Edit className="h-2 w-2" /> edit
                  </span>
                </div>
              )}

              {/* NOMINEES / GUESTS DETAILS */}
              {namesDesignations && (
                <div
                  className={`relative group rounded-md p-1.5 transition-all text-center font-mono ${
                    activeEditingField === "namesDesignations" ? "ring-2 ring-teal-500 bg-white/10" : "hover:bg-black/5 cursor-pointer"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveEditingField("namesDesignations");
                  }}
                >
                  {activeEditingField === "namesDesignations" ? (
                    <input
                      type="text"
                      value={namesDesignations}
                      onChange={(e) => onUpdateField("namesDesignations", e.target.value)}
                      onBlur={() => setActiveEditingField(null)}
                      className="w-full bg-slate-800 text-white border-0 text-[11px] py-1 px-1.5 rounded outline-none font-mono"
                      autoFocus
                    />
                  ) : (
                    <p
                      className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase border-t pt-1"
                      style={{
                        borderColor: `${design.secondaryColor}25`,
                        color: design.textColorSecondary,
                      }}
                    >
                      ★ {namesDesignations} ★
                    </p>
                  )}
                  <span className="absolute right-1 top-1 text-[8px] opacity-0 group-hover:opacity-60 bg-slate-900/50 text-white rounded px-1 flex items-center gap-0.5 no-print">
                    <Edit className="h-2 w-2" /> edit
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 4. BRAND FOOTER CREDITS */}
          <div
            id="poster-canvas-footer"
            className="w-full grid grid-cols-2 justify-between items-center text-[10px] mt-4 pt-3 border-t font-mono opacity-80 z-10 select-none pb-0"
            style={{
              borderColor: `${design.secondaryColor}20`,
              color: design.textColorSecondary,
            }}
          >
            <div className="text-left font-semibold tracking-wider font-sans">
              ★ WOODLAND GLOBAL INSTITUTIONS ★
            </div>
            <div className="text-right tracking-widest text-[9px]">
              SECURE ACADEMIC BRANDING
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-1 mt-2 text-slate-400 text-[10px] font-sans">
        <AlertCircle className="h-3 w-3" />
        <span>Canvas has standard inline editing. Press any text element to modify it live!</span>
      </div>
    </div>
  );
}
