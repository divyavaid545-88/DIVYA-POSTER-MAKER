import React, { useState } from "react";
import Header from "./components/Header";
import ControlPanel from "./components/ControlPanel";
import PosterCanvas from "./components/PosterCanvas";
import AuditPanel from "./components/AuditPanel";
import { DEFAULT_POSTER, PosterData, PosterSize, POSTER_SIZES, SpecialFeaturePreset, AuditReport } from "./types";
import { Sparkles, HelpCircle, CheckCircle, AlertTriangle } from "lucide-react";

export default function App() {
  // Application Workflows States
  const [posterData, setPosterData] = useState<PosterData>(DEFAULT_POSTER);
  const [activeSize, setActiveSize] = useState<PosterSize>(POSTER_SIZES[0]); // Default: Instagram 1:1
  
  // Custom Logos File Upload States
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoFileName, setLogoFileName] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  // People Profile File Upload States
  const [peopleImageFile, setPeopleImageFile] = useState<File | null>(null);
  const [peopleFileName, setPeopleFileName] = useState<string | null>(null);
  const [peopleImageUrl, setPeopleImageUrl] = useState<string | null>(null);

  // Loaders
  const [isAILoading, setIsAILoading] = useState<boolean>(false);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditReport, setAuditReport] = useState<AuditReport | null>(null);
  
  // Toast notifications or mini logs
  const [notification, setNotification] = useState<{ type: "success" | "info" | "error"; text: string } | null>(null);

  const showNotification = (text: string, type: "success" | "info" | "error" = "info") => {
    setNotification({ text, type });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Sync state modifications from form inputs & canvas inline editing
  const handleUpdateField = (field: any, value: any) => {
    if (field === "design") {
      setPosterData((prev) => ({
        ...prev,
        design: {
          ...prev.design,
          ...value,
        },
      }));
    } else {
      setPosterData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  // Load preset school content templates into user workspace
  const handleLoadFeaturePreset = (preset: SpecialFeaturePreset) => {
    setPosterData((prev) => ({
      ...prev,
      title: preset.defaultTitle,
      subtitle: preset.defaultSubtitle,
      mainContent: preset.defaultContent,
      eventDetails: preset.defaultEvent,
      namesDesignations: preset.defaultNames,
    }));
    showNotification(`Special preset for "${preset.name}" loaded successfully. Tap AI Auto-Optimize to calculate bespoke themes!`, "success");
  };

  // Handle Logo uploading
  const handleLogoUpload = (file: File | null) => {
    if (file) {
      setLogoFile(file);
      setLogoFileName(file.name);
      const url = URL.createObjectURL(file);
      setLogoUrl(url);
      showNotification("School branding logo uploaded. Re-evaluating canvas layout positions.", "success");
    } else {
      setLogoFile(null);
      setLogoFileName(null);
      if (logoUrl) URL.revokeObjectURL(logoUrl);
      setLogoUrl(null);
      showNotification("Branding logo removed. Restoring default Woodland shield crest.", "info");
    }
  };

  // Handle students or guest profile image uploads
  const handlePeopleImageUpload = (file: File | null) => {
    if (file) {
      setPeopleImageFile(file);
      setPeopleFileName(file.name);
      const url = URL.createObjectURL(file);
      setPeopleImageUrl(url);
      showNotification("Student/Guest face portrait uploaded. Blending elements on canvas.", "success");
    } else {
      setPeopleImageFile(null);
      setPeopleFileName(null);
      if (peopleImageUrl) URL.revokeObjectURL(peopleImageUrl);
      setPeopleImageUrl(null);
      showNotification("Speaker/topper portrait removed from theme layout.", "info");
    }
  };

  // Trigger server-side AI Content Optimizers & Palette planners
  const handleRunAIOptimization = async () => {
    if (!posterData.title) {
      showNotification("A title is required to trigger model alignment.", "error");
      return;
    }

    setIsAILoading(true);
    showNotification("AI is proofreading content, optimizing grammar and engineering themes...", "info");

    try {
      const response = await fetch("/api/poster/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: posterData.title,
          subtitle: posterData.subtitle,
          mainContent: posterData.mainContent,
          eventDetails: posterData.eventDetails,
          namesDesignations: posterData.namesDesignations,
          themePreference: posterData.design.themeName,
          ratioSize: activeSize.name,
          additionalInstructions: "Ensure ZERO grammar mistakes, flawless spell-checked copy, and premium school style.",
        }),
      });

      if (!response.ok) {
        throw new Error("Generation endpoint returned status " + response.status);
      }

      const optimizedResult = await response.json();
      
      if (optimizedResult.error) {
        throw new Error(optimizedResult.error);
      }

      // Update local state is beautifully structured
      setPosterData({
        title: optimizedResult.title,
        subtitle: optimizedResult.subtitle,
        mainContent: optimizedResult.mainContent,
        eventDetails: optimizedResult.eventDetails,
        namesDesignations: optimizedResult.namesDesignations,
        design: {
          ...posterData.design,
          ...optimizedResult.design,
        },
      });

      showNotification("AI has optimized content & visuals successfully! Running quality check...", "success");

      // Auto run visual audit right after to populate the report beautifully
      handleRunAuditCheck({
        title: optimizedResult.title,
        subtitle: optimizedResult.subtitle,
        mainContent: optimizedResult.mainContent,
        eventDetails: optimizedResult.eventDetails,
        namesDesignations: optimizedResult.namesDesignations,
        design: {
          ...posterData.design,
          ...optimizedResult.design,
        },
      });

    } catch (error) {
      console.error("AI Generation failed:", error);
      showNotification("Branding optimization stalled: " + (error as Error).message, "error");
    } finally {
      setIsAILoading(false);
    }
  };

  // Trigger server-side Quality Compliance checks
  const handleRunAuditCheck = async (overridingData?: PosterData) => {
    const dataToAudit = overridingData || posterData;
    setIsAuditing(true);

    try {
      const response = await fetch("/api/poster/proofread", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToAudit),
      });

      if (!response.ok) {
        throw new Error("Auditor endpoint failed.");
      }

      const report = await response.json();
      setAuditReport(report);
      showNotification("School compliance audit scan successfully finalized!", "success");
    } catch (error) {
      console.error("Audit run failed:", error);
      showNotification("Visual balance check failed to process.", "error");
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div id="woodland-studio-sandbox" className="min-h-screen flex flex-col bg-[#F9F8F3] font-sans">
      
      {/* 1. BRAND HEADER BANNER */}
      <Header userEmail="divyavaid545@gmail.com" />

      {/* 2. THREE-PANEL CREATIVE WORKFLOW WORKBENCH */}
      <div id="workspace-grid-container" className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 md:px-6 md:py-8">
        
        {/* Toast Notification HUD */}
        {notification && (
          <div
            id="workspace-system-hud"
            className={`fixed bottom-4 right-4 z-50 flex items-center space-x-2 px-4 py-3 rounded-xl border shadow-xl max-w-sm transition-all animate-bounce ${
              notification.type === "success"
                ? "bg-teal-900 border-teal-850 text-emerald-100"
                : notification.type === "error"
                ? "bg-red-950 border-red-900 text-red-200"
                : "bg-slate-900 border-slate-800 text-slate-100"
            }`}
          >
            {notification.type === "success" && <CheckCircle className="h-4.5 w-4.5 text-emerald-400 shrink-0" />}
            {notification.type === "error" && <AlertTriangle className="h-4.5 w-4.5 text-red-400 shrink-0" />}
            <span className="text-xs font-semibold leading-relaxed">{notification.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch h-full">
          
          {/* LEFT PANEL: CONFIGURATOR INPUTS & PRESETS (lg:col-span-4) */}
          <section id="configurator-inputs-panel" className="lg:col-span-4 h-full">
            <ControlPanel
              posterData={posterData}
              activeSize={activeSize}
              logoFileName={logoFileName}
              peopleFileName={peopleFileName}
              onUpdateField={handleUpdateField}
              onSelectSize={setActiveSize}
              onLogoUpload={handleLogoUpload}
              onPeopleImageUpload={handlePeopleImageUpload}
              onLoadFeaturePreset={handleLoadFeaturePreset}
              onRunAIOptimization={handleRunAIOptimization}
              isAILoading={isAILoading}
            />
          </section>

          {/* CENTER PANEL: INTERACTIVE CANVAS PLAYGROUND (lg:col-span-5) */}
          <main id="poster-rendering-canvas-panel" className="lg:col-span-5 h-full flex flex-col">
            <PosterCanvas
              posterData={posterData}
              activeSize={activeSize}
              logoUrl={logoUrl}
              peopleImageUrl={peopleImageUrl}
              onUpdateField={handleUpdateField}
            />
          </main>

          {/* RIGHT PANEL: AUDIT CHECKLISTS & PROOFREADING (lg:col-span-3) */}
          <section id="quality-auditing-panel" className="lg:col-span-3 h-full">
            <AuditPanel
              posterData={posterData}
              auditReport={auditReport}
              onRunAudit={() => handleRunAuditCheck()}
              isAuditing={isAuditing}
            />
          </section>

        </div>
      </div>
    </div>
  );
}
