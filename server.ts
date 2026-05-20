import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of GoogleGenAI
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("WARNING: GEMINI_API_KEY is not defined in the environment. Please configure it in your Secrets panel.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// 1. API: Core Poster Content Generation & Styling intelligence
app.post("/api/poster/generate", async (req, res) => {
  try {
    const {
      title,
      subtitle,
      mainContent,
      eventDetails,
      namesDesignations,
      themePreference,
      ratioSize,
      specialModule,
      additionalInstructions,
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Poster Topic is required." });
    }

    const ai = getGeminiClient();

    // Constructing a detailed prompt that strictly enforces professional copy, zero spelling/grammar mistakes, and high academic standard
    const systemPrompt = `You are the lead Creative Director, Senior Designer, and Expert English Copywriter for "Woodland Overseas School".
You have a strict ZERO-MISTAKE mandate. Every output must be in flawless, high-grade professional English suitable for prime international academic branding. Correct any spelling errors, awkward phrasing, or grammatical mistakes in the input.

Make sure to format the headings and structured content with punchy, premium vocabulary (no cliches, keep it sophisticated like Adobe Express / Canva Pro).

Based on the user's details, you will also decide the ultimate graphic design rules for this poster:
1. Palette selection (professional and cohesive hues matching topic standards).
2. Layout strategy ("centered", "split", "grid-masonry", "elegant-card", "hero-showcase")
3. Aesthetic background style ("academic-shield", "abstract-gradients", "geometric-lines", "cyber-grid", "playful-particles", "clean-minimal")
4. Logo auto-placement preference ("top-left", "top-center", "top-right") depending on the visual layout composition to make sure the school logo is beautifully integrated.

Topic-Based Auto Styling constraints that you MUST strictly respect:
- Cyber Awareness or Tech Topics:
  * Style: "dark blue tech style"
  * Primary color: dark blue or deep slate (e.g., #0B0F19, #020B1A)
  * Secondary and accents: bright cyan or neon highlights (e.g., #22D3EE, #38BDF8)
  * Background style: "cyber-grid"

- Admissions:
  * Style: "elegant academic style"
  * Primary color: rich scholar green or deep academic navy (e.g., #1A2E2A, #0A2540)
  * Secondary and accents: soft cream and warm gold (e.g., #E2B842, #A3B18A)
  * Background style: "academic-shield"

- Kids Event or Carnival:
  * Style: "colorful playful style"
  * Primary color: warm engaging orange, bright yellow, or playful sky blue (e.g., #EA580C)
  * Secondary and accents: sun yellow, bright blue (e.g., #FBBF24, #3B82F6)
  * Background style: "playful-particles"

- Achievements, Medals, or Laurels:
  * Style: "premium luxury style"
  * Primary color: deep forest green or prestige burgundy (e.g., #0F4C3A, #4C0F10)
  * Secondary and accents: rich luxury gold (#D4AF37) and starry accents
  * Background style: "geometric-lines" or "academic-shield"

- Workshop, Bootcamp, or Seminar:
  * Style: "modern educational style"
  * Primary color: modern charcoal or titanium gray (e.g., #1E293B)
  * Secondary and accents: high-contrast clean blue or slate (#38BDF8, #64748B)
  * Background style: "clean-minimal"

- Result Highlight (Toppers / Exam board success):
  * Style: "clean academic highlight style"
  * Primary color: very high contrast dark slate or navy (#0F172A)
  * Secondary: pristine crisp white or classic clear school gold (#FFC107)
  * Background style: "abstract-gradients" or "geometric-lines" for neat composition grids.

Default -> "elegant-card" layout with clean, corporate, premium educational aesthetics.`;

    const userPrompt = `Generate a fully optimized and designed school poster configuration. Here are the user inputs:
- Poster Title: "${title}"
- Subtitle: "${subtitle || ""}"
- Main Content Body: "${mainContent || ""}"
- Event/Date/Time/Venue Details: "${eventDetails || ""}"
- Key Names & Designations: "${namesDesignations || ""}"
- Theme Preference requested by user: "${themePreference || "Auto-detect matches topic"}"
- Size/Ratio: "${ratioSize || "Instagram Post (1:1)"}"
- Special Module Preset active: "${specialModule || "None / General"}"
- Additional Custom Instructions: "${additionalInstructions || "None"}"

Correct all spelling and grammar issues. Elevate the vocabulary to be inspiring, ultra-premium, and engaging.
Return the structured response in JSON format.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["title", "subtitle", "mainContent", "eventDetails", "namesDesignations", "design"],
          properties: {
            title: {
              type: Type.STRING,
              description: "Flawlessly spellchecked and highly engaging academic title/headline.",
            },
            subtitle: {
              type: Type.STRING,
              description: "Corrected professional supporting subtitle or theme statement.",
            },
            mainContent: {
              type: Type.STRING,
              description: "Optimized primary body text, split beautifully with bullet points or paragraphs if needed.",
            },
            eventDetails: {
              type: Type.STRING,
              description: "Clean, structured details showing Date, Time, Venue, Contact or CTA details beautifully.",
            },
            namesDesignations: {
              type: Type.STRING,
              description: "Fineshed names of Chief Guests, Speakers, or Achievers with their titles.",
            },
            design: {
              type: Type.OBJECT,
              required: [
                "themeName",
                "primaryColor",
                "secondaryColor",
                "accentColor",
                "backgroundColor",
                "cardBackground",
                "bgGradientStart",
                "bgGradientEnd",
                "textColorPrimary",
                "textColorSecondary",
                "logoPosition",
                "layoutStyle",
                "backgroundStyle",
                "fontPairing"
              ],
              properties: {
                themeName: { type: Type.STRING, description: "A high-concept name for the theme, e.g. Academic Navy, Playful Sunrise, Golden Heritage, Neon Cyber." },
                primaryColor: { type: Type.STRING, description: "Hex code format, e.g. #0D233A" },
                secondaryColor: { type: Type.STRING, description: "Hex code format, e.g. #D4AF37" },
                accentColor: { type: Type.STRING, description: "Hex code format, e.g. #F4B400" },
                backgroundColor: { type: Type.STRING, description: "Base dark/light canvas background hex code, e.g. #F8FAFC" },
                cardBackground: { type: Type.STRING, description: "RGBA background overlay value for content cards, e.g., 'rgba(255,255,255,0.92)' or 'rgba(15,23,42,0.85)'" },
                bgGradientStart: { type: Type.STRING, description: "Gradient start hex, e.g. #0F172A" },
                bgGradientEnd: { type: Type.STRING, description: "Gradient end hex, e.g. #1E293B" },
                textColorPrimary: { type: Type.STRING, description: "Primary text hex, e.g. #0F172A" },
                textColorSecondary: { type: Type.STRING, description: "Secondary details text hex, e.g. #475569" },
                logoPosition: {
                  type: Type.STRING,
                  enum: ["top-left", "top-center", "top-right"],
                  description: "Suggested top positioning of the logo based on the layout composition.",
                },
                layoutStyle: {
                  type: Type.STRING,
                  enum: ["centered", "split", "grid-masonry", "elegant-card", "hero-showcase"],
                  description: "Structural layout to apply.",
                },
                backgroundStyle: {
                  type: Type.STRING,
                  enum: ["academic-shield", "abstract-gradients", "geometric-lines", "cyber-grid", "playful-particles", "clean-minimal"],
                  description: "Dynamic visual background pattern style.",
                },
                fontPairing: {
                  type: Type.OBJECT,
                  required: ["headerFont", "bodyFont", "styleId"],
                  properties: {
                    headerFont: { type: Type.STRING, description: "Header font family e.g. Space Grotesk, Playfair Display, Outfit" },
                    bodyFont: { type: Type.STRING, description: "Body font family e.g. Inter, JetBrains Mono" },
                    styleId: { type: Type.STRING, description: "Identifier e.g. academic, playful, tech, modern" },
                  },
                },
                decorations: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Keywords representing graphic accents to draw (e.g. stars, rings, school-crests, borders).",
                },
              },
            },
          },
        },
      },
    });

    const parsedJson = JSON.parse(response.text || "{}");
    res.json(parsedJson);
  } catch (error) {
    console.error("Error during poster generation:", error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// 2. API: Proofreading & Deep Audits
app.post("/api/poster/proofread", async (req, res) => {
  try {
    const { title, subtitle, mainContent, eventDetails, namesDesignations, design } = req.body;
    const ai = getGeminiClient();

    const auditPrompt = `You are the Expert Proofreader and Academic Quality Assurer for "Woodland Overseas School".
Analyze the current poster design setup and perform a thorough compliance audit for professional, print-ready quality.

Current Poster Data:
- Title: "${title}"
- Subtitle: "${subtitle}"
- Main Content: "${mainContent}"
- Event Details: "${eventDetails}"
- Key Names & Designations: "${namesDesignations}"
- Layout Style: "${design?.layoutStyle}"
- Colors Chosen: Primary: "${design?.primaryColor}", Secondary: "${design?.secondaryColor}", Text: "${design?.textColorPrimary}"

Please run these 4 audits:
1. Spelling & Grammar check: Verify if there are any typos or grammar improvements. Raise flags if any are found.
2. Readability & Contrast check: Check if colors of text and cards contrast well (e.g., highly readable from a distance).
3. Composition & Volume check: Warn if there is too much text for a professional poster or if it feels overcrowded.
4. Alignment & Spacing recommendation: Advise on layout balances.

Return a structured JSON report with specific suggestions.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: auditPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["isCompliant", "audits", "overallAdvice", "score"],
          properties: {
            isCompliant: { type: Type.BOOLEAN, description: "True if layout has zero mistakes and looks high standard." },
            score: { type: Type.INTEGER, description: "Mock design quality score from 1-100." },
            overallAdvice: { type: Type.STRING, description: "Consolidated quality executive summary advice." },
            audits: {
              type: Type.OBJECT,
              required: ["grammarAndSpelling", "readabilityContrast", "compositionVolume", "layoutBalance"],
              properties: {
                grammarAndSpelling: {
                  type: Type.OBJECT,
                  required: ["status", "errorsFound", "suggestionText"],
                  properties: {
                    status: { type: Type.STRING, description: "Check status: Excellent, Passed with suggestions, or Failed." },
                    errorsFound: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of explicit corrections." },
                    suggestionText: { type: Type.STRING, description: "Direct advice to apply." },
                  },
                },
                readabilityContrast: {
                  type: Type.OBJECT,
                  required: ["status", "suggestionText"],
                  properties: {
                    status: { type: Type.STRING },
                    suggestionText: { type: Type.STRING },
                  },
                },
                compositionVolume: {
                  type: Type.OBJECT,
                  required: ["status", "suggestionText"],
                  properties: {
                    status: { type: Type.STRING },
                    suggestionText: { type: Type.STRING },
                  },
                },
                layoutBalance: {
                  type: Type.OBJECT,
                  required: ["status", "suggestionText"],
                  properties: {
                    status: { type: Type.STRING },
                    suggestionText: { type: Type.STRING },
                  },
                },
              },
            },
          },
        },
      },
    });

    const parsedReport = JSON.parse(response.text || "{}");
    res.json(parsedReport);
  } catch (error) {
    console.error("Error during poster proofread:", error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// Setup Vite Development Server or Serve Production Asset
async function startApp() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Woodland AI Poster Studio Server] Running on http://localhost:${PORT}`);
  });
}

startApp().catch((err) => {
  console.error("Failed to start Woodland AI Poster Studio Server:", err);
});
