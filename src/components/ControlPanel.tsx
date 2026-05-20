import React, { useRef, useState } from "react";
import { Sparkles, Calendar, BookOpen, User, Image, Upload, Trash2, Sliders, Layout, RefreshCw, FileImage, ShieldAlert, Award, Grid, Star, Play } from "lucide-react";
import { PosterData, PosterSize, POSTER_SIZES, SPECIAL_FEATURES, SpecialFeaturePreset } from "../types";

interface ControlPanelProps {
  posterData: PosterData;
  activeSize: PosterSize;
  logoFileName: string | null;
  peopleFileName: string | null;
  onUpdateField: (field: keyof Omit<PosterData, "design"> | "title" | "subtitle" | "mainContent" | "eventDetails" | "namesDesignations" | "design", value: any) => void;
  onSelectSize: (size: PosterSize) => void;
  onLogoUpload: (file: File | null) => void;
  onPeopleImageUpload: (file: File | null) => void;
  onLoadFeaturePreset: (preset: SpecialFeaturePreset) => void;
  onRunAIOptimization: () => void;
  isAILoading: boolean;
}

export default function ControlPanel({
  posterData,
  activeSize,
  logoFileName,
  peopleFileName,
  onUpdateField,
  onSelectSize,
  onLogoUpload,
  onPeopleImageUpload,
  onLoadFeaturePreset,
  onRunAIOptimization,
  isAILoading,
}: ControlPanelProps) {
  const [showOverrides, setShowOverrides] = useState<boolean>(false);
  const [useRawTopicMode, setUseRawTopicMode] = useState<boolean>(true);
  
  // Local state to keep track of a quick topic description
  const [topicInput, setTopicInput] = useState<string>(
    posterData.title && posterData.title !== "WOODLAND OVERSEAS SCHOOL BRACE FOR THE FUTURE" 
      ? posterData.title 
      : "Admissions Open for 2026-27 with State of the art tech labs and sports fields for Grade 1-12 kids!"
  );
  const [detailsInput, setDetailsInput] = useState<string>("");

  const logoInputRef = useRef<HTMLInputElement>(null);
  const peopleInputRef = useRef<HTMLInputElement>(null);

  const { title, subtitle, mainContent, eventDetails, namesDesignations, design } = posterData;

  // Faster Topic suggestion triggers
  const PRESETS_TOPICS = [
    {
      label: "🛡️ Cyber safety camp",
      topic: "Cyber Safety & Digital Awareness Symposium for kids next Saturday",
      details: "David Miller Speaker (CISSP Security expert). Block-A Lab. Guidelines for internet ethics, reporting cyberbullying.",
      module: "cyber"
    },
    {
      label: "🎒 Admissions open",
      topic: "Shaping leaders of tomorrow: Admissions Open for Academic Session 2026-2027",
      details: "Registrations closing soon. Walk-in Monday to Saturday: 8 AM to 2 PM. Modern research classrooms, international streams.",
      module: "admission"
    },
    {
      label: "🏆 CBSE Result highlight",
      topic: "Class XII AISSCE Board Outstanding Toppers Achievements Highlights",
      details: "Woodland Overseas School triples academic milestones with 100% toppers success rate across all streams.",
      module: "result"
    },
    {
      label: "⭐ Achievement & medals",
      topic: "Mavericks win first rank gold crest in National Cognitive Science Bowl",
      details: "Mentor Coach Dr. Angela Wu and captain Neil Sterling. Spectacular victory against 240 secondary schools.",
      module: "achievement"
    },
    {
      label: "🎨 Cultural Harmony fest",
      topic: "Annual Harmony Fest & Music Cultural Grand Celebration Soiree",
      details: "Friday May 29 at 5:30 PM. Venue: Grand Campus Amphitheatre. Guest Justice Evelyn Shaw.",
      module: "invitation"
    }
  ];

  const handleApplyQuickTopic = (item: typeof PRESETS_TOPICS[0]) => {
    setTopicInput(item.topic);
    setDetailsInput(item.details);
    // Prefill posterData fields directly so AI has a base to optimize
    onUpdateField("title", item.topic);
    onUpdateField("mainContent", item.details);
    
    // Also load the special default template data so the user sees immediate premium feedback
    const findPreset = SPECIAL_FEATURES.find(x => x.id === item.module);
    if (findPreset) {
      onLoadFeaturePreset(findPreset);
    }
  };

  const handleMagicGenerationClick = () => {
    // Sync local topic before starting AI optimization query
    onUpdateField("title", topicInput);
    if (detailsInput) {
      onUpdateField("mainContent", detailsInput);
    }
    // Small timeout to let react state commit before fetch
    setTimeout(() => {
      onRunAIOptimization();
    }, 100);
  };

  // Custom theme overrides
  const handleThemePresetSelect = (themeType: string) => {
    let colors = { ...design };
    switch (themeType) {
      case "navy_gold":
        colors = {
          ...design,
          themeName: "Academic Navy & Rich Gold",
          primaryColor: "#0F2D4A",
          secondaryColor: "#D4AF37",
          accentColor: "#F39C12",
          backgroundColor: "#F8FAFC",
          cardBackground: "rgba(255, 255, 255, 0.96)",
          bgGradientStart: "#0A2540",
          bgGradientEnd: "#1A4975",
          textColorPrimary: "#0F172A",
          textColorSecondary: "#475569",
          backgroundStyle: "academic-shield"
        };
        break;
      case "emerald_gold":
        colors = {
          ...design,
          themeName: "Academic Emerald Prestige",
          primaryColor: "#0F4C3A",
          secondaryColor: "#D4AF37",
          accentColor: "#10B981",
          backgroundColor: "#F4FDF9",
          cardBackground: "rgba(255, 255, 255, 0.95)",
          bgGradientStart: "#0D3C2E",
          bgGradientEnd: "#1A6F54",
          textColorPrimary: "#072C21",
          textColorSecondary: "#3F6B5F",
          backgroundStyle: "geometric-lines"
        };
        break;
      case "cyber_neon":
        colors = {
          ...design,
          themeName: "Cyber Neon awareness",
          primaryColor: "#0B0F19",
          secondaryColor: "#38BDF8",
          accentColor: "#A855F7",
          backgroundColor: "#030712",
          cardBackground: "rgba(15, 23, 42, 0.85)",
          bgGradientStart: "#030712",
          bgGradientEnd: "#111827",
          textColorPrimary: "#F8FAFC",
          textColorSecondary: "#9CA3AF",
          backgroundStyle: "cyber-grid"
        };
        break;
      case "playful":
        colors = {
          ...design,
          themeName: "Playful Primary Sun",
          primaryColor: "#EA580C",
          secondaryColor: "#3B82F6",
          accentColor: "#FBBF24",
          backgroundColor: "#FFFBEB",
          cardBackground: "rgba(255, 255, 255, 0.94)",
          bgGradientStart: "#FFF7ED",
          bgGradientEnd: "#FED7AA",
          textColorPrimary: "#7C2D12",
          textColorSecondary: "#9A3412",
          backgroundStyle: "playful-particles"
        };
        break;
      case "academic_classic":
        colors = {
          ...design,
          themeName: "Classic Academic Blue",
          primaryColor: "#0A2540",
          secondaryColor: "#E2B842",
          accentColor: "#F4B400",
          backgroundColor: "#F8FAFC",
          cardBackground: "rgba(255, 255, 255, 0.95)",
          bgGradientStart: "#0A2540",
          bgGradientEnd: "#1A4975",
          textColorPrimary: "#0F172A",
          textColorSecondary: "#475569",
          backgroundStyle: "academic-shield"
        };
        break;
      case "charcoal":
        colors = {
          ...design,
          themeName: "Studio Chalk Board",
          primaryColor: "#1E293B",
          secondaryColor: "#F1F5F9",
          accentColor: "#38BDF8",
          backgroundColor: "#0F172A",
          cardBackground: "rgba(30, 41, 59, 0.95)",
          bgGradientStart: "#0F172A",
          bgGradientEnd: "#334155",
          textColorPrimary: "#F8FAFC",
          textColorSecondary: "#CBD5E1",
          backgroundStyle: "clean-minimal"
        };
        break;
      case "bold_typography":
        colors = {
          ...design,
          themeName: "Bold Typography Pro",
          primaryColor: "#020B1A",
          secondaryColor: "#22D3EE",
          accentColor: "#A3B18A",
          backgroundColor: "#020B1A",
          cardBackground: "rgba(2, 11, 26, 0.8)",
          bgGradientStart: "#020B1A",
          bgGradientEnd: "#0C1E36",
          textColorPrimary: "#FFFFFF",
          textColorSecondary: "#A3B18A",
          backgroundStyle: "cyber-grid",
          layoutStyle: "centered"
        };
        break;
      default:
        break;
    }
    onUpdateField("design", colors);
  };

  return (
    <div id="designer-control-panel" className="bg-[#1D322E] text-white rounded-2xl border border-white/10 p-5 shadow-2xl flex flex-col h-full justify-between font-sans">
      
      {/* HEADER STATUS BADGE */}
      <div className="mb-4">
        <div className="flex items-center gap-2 text-[#A3B18A] mb-1.5 font-bold uppercase tracking-widest text-[11px]">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
          <span>WOODLAND CREATIVE CO-PILOT</span>
        </div>
        <h3 className="text-lg font-black tracking-tight font-sans text-white uppercase leading-none">
          AI Auto-Poster Engine
        </h3>
        <p className="text-xs text-slate-300 mt-1.5 font-sans leading-relaxed">
          Type the core topic description below. AI writes professional copies, auto-corrects spelling, formats layout structure and applies themes instantly.
        </p>
      </div>

      {/* CORE WORKSPACE INPUT SCROLL CONTAINER */}
      <div className="flex-1 overflow-y-auto pr-1 max-h-[550px] min-h-[350px] space-y-4 pb-4 select-text">
        
        {/* STEP 1: TYPED THEME TOPIC OR EVENT QUESTION */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
          <label className="block text-xs font-extrabold uppercase tracking-widest text-[#A3B18A]">
            STEP 1: What is this poster about? *
          </label>
          
          <textarea
            value={topicInput}
            onChange={(e) => {
              setTopicInput(e.target.value);
              onUpdateField("title", e.target.value);
            }}
            placeholder="Type your event theme (e.g. Chess Tournament this Sunday at 9 AM, Admissions Open for classes 1st and 10th with sports arena)"
            rows={3}
            className="w-full text-xs font-sans rounded-lg border border-white/10 bg-black/20 py-2.5 px-3 focus:border-[#A3B18A] outline-none text-white placeholder-slate-400 font-medium leading-normal"
          />

          <div>
            <label className="block text-[10px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
              Secondary Content Context / Details (Optional)
            </label>
            <input
              type="text"
              value={detailsInput}
              onChange={(e) => {
                setDetailsInput(e.target.value);
                onUpdateField("mainContent", e.target.value);
              }}
              placeholder="E.g. Guest Speaker, specific rewards, or Contact +1800"
              className="w-full text-xs font-sans rounded-lg border border-white/10 bg-black/20 py-2 px-3 focus:border-[#A3B18A] outline-none text-white placeholder-slate-400"
            />
          </div>

          {/* Quick Prefill Pill Suggestion items */}
          <div className="space-y-1.5 pt-1.5">
            <span className="block text-[10px] font-bold uppercase text-[#A3B18A] tracking-widest leading-none">
              💡 Woodland AI Suggestions (Tap to prefill):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS_TOPICS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyQuickTopic(item)}
                  className="text-[10px] font-semibold bg-white/10 hover:bg-[#A3B18A]/20 hover:text-white text-slate-200 border border-white/5 rounded-full px-2.5 py-1.5 transition-all text-left cursor-pointer active:scale-95 whitespace-nowrap"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* STEP 2: CANVAS SIZE & RATIO OPTION */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
          <label className="block text-xs font-extrabold uppercase tracking-widest text-[#A3B18A]">
            STEP 2: Select Canvas Size & Aspect Ratio:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {POSTER_SIZES.slice(0, 6).map((size) => (
              <button
                key={size.id}
                onClick={() => onSelectSize(size)}
                className={`p-2 text-left rounded-lg transition-all border text-[11px] cursor-pointer ${
                  activeSize.id === size.id
                    ? "border-[#A3B18A] bg-[#A3B18A]/15 text-[#A3B18A]"
                    : "border-white/10 bg-black/10 text-slate-300 hover:bg-white/5"
                }`}
              >
                <div className="font-bold flex items-center justify-between">
                  <span>{size.name}</span>
                  <span className="font-mono text-[9px] text-[#A3B18A]/80 font-normal">{size.ratio}</span>
                </div>
                <p className="text-[9px] text-slate-400 truncate mt-0.5">{size.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* STEP 3: CREATIVE UPLOADS PORTRAIT (OPTIONAL) */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
          <label className="block text-xs font-extrabold uppercase tracking-widest text-[#A3B18A]">
            Step 3: Upload Student Topper / Guest picture(Optional)
          </label>
          <p className="text-[10px] text-slate-300 leading-normal">
            Upload picture of speaker, toppers, or event participants. AI merges them into layouts automatically.
          </p>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => peopleInputRef.current?.click()}
              className="flex items-center space-x-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors border border-white/10"
            >
              <Upload className="h-3.5 w-3.5 text-[#A3B18A]" />
              <span>{peopleFileName ? "Replace Picture" : "Upload Picture"}</span>
            </button>
            <input
              type="file"
              ref={peopleInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                onPeopleImageUpload(file);
              }}
              accept="image/*"
              className="hidden"
            />
            {peopleFileName && (
              <div className="flex items-center justify-between flex-1 bg-black/20 rounded-lg py-1 px-2.5 border border-white/10 text-xs">
                <span className="truncate max-w-[120px] font-mono font-medium text-[10px] text-slate-300">{peopleFileName}</span>
                <button
                  onClick={() => onPeopleImageUpload(null)}
                  className="text-red-400 hover:text-red-300 font-bold"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* DYNAMIC WOODLAND CREST LOGO IS ALWAYS AUTOMATIC */}
        <div className="p-3 bg-emerald-950/40 border border-emerald-800/35 rounded-xl flex items-center space-x-2">
          <Award className="h-5 w-5 text-[#A3B18A] shrink-0 animate-pulse" />
          <div className="text-[10px] font-sans text-slate-300 font-medium">
            🛡️ <strong className="text-[#A3B18A] uppercase">Woodland Crest Auto-Placement Active:</strong> Original school crest is automatically formatted for size and contrast with zero text overlaying interference.
          </div>
        </div>

        {/* COLLAPSIBLE ADVANCED CREATIVE OVERRIDES */}
        <div className="border-t border-white/10 pt-3">
          <button
            type="button"
            onClick={() => setShowOverrides(!showOverrides)}
            className="w-full flex items-center justify-between py-1 text-[11px] font-extrabold uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
          >
            <span>🔧 Advanced Text & Brand Overrides</span>
            <span>{showOverrides ? "[Hide]" : "[Reveal]"}</span>
          </button>

          {showOverrides && (
            <div className="space-y-3 pt-3 font-sans text-xs animate-fadeIn">
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-[10px] rounded-lg">
                ⚠️ Overrides values manually bypasses full AI generation but allow individual word edits immediately!
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-300 mb-1">Headline Override</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => onUpdateField("title", e.target.value)}
                  className="w-full text-xs rounded border border-white/10 bg-black/30 py-1.5 px-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-300 mb-1">Subtitle / Slogan</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => onUpdateField("subtitle", e.target.value)}
                  className="w-full text-xs rounded border border-white/10 bg-black/30 py-1.5 px-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-300 mb-1">Fine Content Body</label>
                <textarea
                  value={mainContent}
                  onChange={(e) => onUpdateField("mainContent", e.target.value)}
                  rows={2}
                  className="w-full text-xs rounded border border-white/10 bg-black/30 py-1 px-2 text-white outline-none"
                />
              </div>

              {/* LOGO POSITION CHOICE OVERRIDES */}
              <div>
                <label className="block text-[10px] font-bold text-slate-300 mb-1">Logo Positioning</label>
                <select
                  value={design.logoPosition}
                  onChange={(e) => onUpdateField("design", { ...design, logoPosition: e.target.value })}
                  className="w-full text-xs rounded border border-white/10 bg-[#1D322E] py-1 px-2 text-white outline-none"
                >
                  <option value="top-left">Top Left</option>
                  <option value="top-center">Top Center (Crest focused)</option>
                  <option value="top-right">Top Right</option>
                </select>
              </div>

              {/* BRAND COLOR PALETTE OVERRIDER */}
              <div>
                <label className="block text-[10px] font-bold text-slate-300 mb-1.5">Preset Palette Fallbacks</label>
                <div className="grid grid-cols-1 gap-1.5">
                  <button
                    onClick={() => handleThemePresetSelect("bold_typography")}
                    className="flex items-center justify-between p-1.5 rounded bg-white/5 border border-white/10 text-[10px] text-slate-200 hover:bg-white/10"
                  >
                    <span>★ Bold Typography Theme</span>
                    <span className="h-3 w-3 rounded-full bg-[#020B1A]" />
                  </button>
                  <button
                    onClick={() => handleThemePresetSelect("navy_gold")}
                    className="flex items-center justify-between p-1.5 rounded bg-white/5 border border-white/10 text-[10px] text-slate-200 hover:bg-white/10"
                  >
                    <span>Academic Navy & Gold</span>
                    <span className="h-3 w-3 rounded-full bg-[#0F2D4A]" />
                  </button>
                  <button
                    onClick={() => handleThemePresetSelect("emerald_gold")}
                    className="flex items-center justify-between p-1.5 rounded bg-white/5 border border-white/10 text-[10px] text-slate-200 hover:bg-white/10"
                  >
                    <span>Emerald Scholar Prestige</span>
                    <span className="h-3 w-3 rounded-full bg-[#0F4C3A]" />
                  </button>
                  <button
                    onClick={() => handleThemePresetSelect("cyber_neon")}
                    className="flex items-center justify-between p-1.5 rounded bg-white/5 border border-white/10 text-[10px] text-slate-200 hover:bg-white/10"
                  >
                    <span>Cyber Security Neon Alert</span>
                    <span className="h-3 w-3 rounded-full bg-[#0B0F19]" />
                  </button>
                  <button
                    onClick={() => handleThemePresetSelect("playful")}
                    className="flex items-center justify-between p-1.5 rounded bg-white/5 border border-white/10 text-[10px] text-slate-200 hover:bg-white/10"
                  >
                    <span>Colorful Fun Carnival</span>
                    <span className="h-3 w-3 rounded-full bg-[#EA580C]" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* CORE 1-CLICK MAGIC GENERATION CAPABILITY TRIGGER */}
      <div className="border-t border-white/10 pt-4 mt-2">
        <button
          id="ai-optimize-button"
          onClick={handleMagicGenerationClick}
          disabled={isAILoading || !topicInput}
          className="w-full flex items-center justify-center space-x-2 py-4 px-4 rounded-xl font-black text-xs uppercase tracking-wider bg-gradient-to-r from-[#A3B18A] to-[#8FA176] text-[#1A2E2A] hover:bg-none hover:bg-white hover:text-[#1A2E2A] transition-all shadow-2xl active:scale-97 disabled:opacity-40 cursor-pointer"
        >
          {isAILoading ? (
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-4.5 w-4.5 animate-spin text-[#1A2E2A]" />
              <span className="animate-pulse">Creating School Poster...</span>
            </div>
          ) : (
            <>
              <Sparkles className="h-4.5 w-4.5 text-[#1A2E2A] fill-[#1A2E2A] animate-bounce" />
              <span>🤖 CREATE PREMIUM SCHOOL POSTER INSTANTLY</span>
            </>
          )}
        </button>
        <p className="text-[9px] text-center text-slate-300 mt-2 font-mono">
          Woodland AI automatically designs print & social-media ready compositions.
        </p>
      </div>

      {/* FOOTER BRAND CREDITS */}
      <div id="footer-branding-status" className="border-t border-white/5 mt-3 pt-2.5 flex items-center justify-between text-[9px] text-slate-400 font-mono select-none">
        <span className="uppercase">Woodland AI Studio v2.0</span>
        <span className="text-[#A3B18A] bg-white/5 px-2 py-0.5 rounded font-bold font-mono">Active</span>
      </div>
    </div>
  );
}
