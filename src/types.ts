/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FontPairing {
  headerFont: string;
  bodyFont: string;
  styleId: string;
}

export interface PosterDesign {
  themeName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  cardBackground: string;
  bgGradientStart: string;
  bgGradientEnd: string;
  textColorPrimary: string;
  textColorSecondary: string;
  logoPosition: "top-left" | "top-center" | "top-right";
  layoutStyle: "centered" | "split" | "grid-masonry" | "elegant-card" | "hero-showcase";
  backgroundStyle: "academic-shield" | "abstract-gradients" | "geometric-lines" | "cyber-grid" | "playful-particles" | "clean-minimal";
  fontPairing: FontPairing;
  decorations?: string[];
}

export interface PosterData {
  title: string;
  subtitle: string;
  mainContent: string;
  eventDetails: string;
  namesDesignations: string;
  design: PosterDesign;
}

export interface AuditReport {
  isCompliant: boolean;
  score: number;
  overallAdvice: string;
  audits: {
    grammarAndSpelling: {
      status: string;
      errorsFound: string[];
      suggestionText: string;
    };
    readabilityContrast: {
      status: string;
      suggestionText: string;
    };
    compositionVolume: {
      status: string;
      suggestionText: string;
    };
    layoutBalance: {
      status: string;
      suggestionText: string;
    };
  };
}

export interface PosterSize {
  id: string;
  name: string;
  ratio: string; // Tailwinds aspect-ratio class (or numerical ratio)
  width: number; // For canvas viewport resizing
  height: number;
  description: string;
}

export const POSTER_SIZES: PosterSize[] = [
  { id: "insta_post", name: "Instagram Post", ratio: "1/1", width: 500, height: 500, description: "Square (1:1)" },
  { id: "insta_story", name: "Instagram Story", ratio: "9/16", width: 360, height: 640, description: "Story / Portrait (9:16)" },
  { id: "slide", name: "Presentation Slide", ratio: "16/9", width: 640, height: 360, description: "Landscape (16:9)" },
  { id: "a4_portrait", name: "A4 Portrait", ratio: "1/1.414", width: 450, height: 636, description: "Standard A4 flyer (Portrait)" },
  { id: "a4_landscape", name: "A4 Landscape", ratio: "1.414/1", width: 636, height: 450, description: "Standard A4 flyer (Landscape)" },
  { id: "whatsapp", name: "WhatsApp Poster", ratio: "4/5", width: 440, height: 550, description: "Optimized portrait (4:5)" },
  { id: "youtube", name: "YouTube Thumbnail", ratio: "16/9", width: 600, height: 337, description: "Video cover (16:9)" },
  { id: "flex_banner", name: "Flex Banner", ratio: "2/1", width: 640, height: 320, description: "Wide banner (2:1)" }
];

export interface SpecialFeaturePreset {
  id: string;
  name: string;
  description: string;
  defaultTitle: string;
  defaultSubtitle: string;
  defaultContent: string;
  defaultEvent: string;
  defaultNames: string;
  suggestedTheme: string;
}

export const SPECIAL_FEATURES: SpecialFeaturePreset[] = [
  {
    id: "result",
    name: "🏆 CBSE Result Highlight",
    description: "Generate academic achievement, toppers' highlight and board results.",
    defaultTitle: "WOODLAND OVERSEAS SCHOOL TRIPLE TRIUMPH",
    defaultSubtitle: "Class XII AISSCE Board Results Milestone 2026",
    defaultContent: "Our Woodlandians have scaled spectacular heights yet again with a record-shattering performance. 100% Success metrics achieved with zero deviations.",
    defaultEvent: "School Toppers declared at Administrative Wing. Contact registration office at +1-800-WOODLAND for transcript verifications.",
    defaultNames: "Principal: Dr. Sarah Jenkins | Chief Academic Officer: Prof. Robert Vance",
    suggestedTheme: "Academic Deep Navy & Rich Gold"
  },
  {
    id: "admission",
    name: "🎒 Admission Open 2026-27",
    description: "Promote registrations, school values, streams, and campus facility details.",
    defaultTitle: "SHAPING GLOBALLY COMPETENT LEADERS",
    defaultSubtitle: "Admissions Officially Open for Academic Session 2026-2027",
    defaultContent: "Give your child the gift of immersive, modern learning across Advanced Science, Innovation & Arts streams. State-of-the-art tech workspace rooms, international curriculums, and dedicated high-performance athletic arenas.",
    defaultEvent: "Registrations closing soon. Walk-in admissions active Monday to Saturday: 8 AM to 2 PM at Admissions Lobby. Apply online: admission.woodland.pre",
    defaultNames: "Admissions Chair: Mr. Albert K. Thorne | Dean of Students: Mrs. Olivia Ross",
    suggestedTheme: "Premium Academic Emerald"
  },
  {
    id: "achievement",
    name: "⭐ Achievement & Accolades",
    description: "Showcase national competition victories, sports championships or medals.",
    defaultTitle: "VICTORY AT THE NATIONAL COGNITIVE BOWL",
    defaultSubtitle: "First Rank Consecutively Secured by the Woodland Mavericks",
    defaultContent: "Our senior science delegation outpaced 240 secondary institutions nationwide, securing the Gold Crest. A celebration of pure intelligence, research, and technical resolve.",
    defaultEvent: "Felicitation Ceremony: Friday, May 22, 2026 at the Main Auditorium at 10:00 AM.",
    defaultNames: "Mentor Coach: Dr. Angela Wu | Team Captain: Master Neil Sterling",
    suggestedTheme: "Luxury Green & Gold Academic"
  },
  {
    id: "invitation",
    name: "✉️ Event Invitation",
    description: "Create elegant invitations for Annual Days, Parent Teacher meetings, workshops.",
    defaultTitle: "ANNUAL HARMONY FEST & CULTURAL SOIREE",
    defaultSubtitle: "A Vibrant Celebration of Music, Theatre, and Global Art",
    defaultContent: "We cardially invite our respected parents, trustees, and well-wishers to witness the multi-sensory orchestrations rendered by our talented young learners.",
    defaultEvent: "Date: Friday, May 29, 2026 | Time: 5:30 PM Onwards | Venue: Grand Amphitheatre, Campus North.",
    defaultNames: "Chief Dignitary Guest: Honorable Justice Evelyn Shaw",
    suggestedTheme: "Deep Purple & Cosmic Gold"
  },
  {
    id: "cyber",
    name: "🛡️ Cyber Awareness Campaign",
    description: "Urge safe online behavior, guidelines for young learners, and cyber ethics.",
    defaultTitle: "GUARDIANS OF THE DIGITAL REALM",
    defaultSubtitle: "Essential Cyber Security & Digital Safety Protocol for Kids",
    defaultContent: "Protect your digital identity! Avoid sharing passwords, verify links before tapping, turn off geolocation on social platforms, and report cyberbullying instantly to school supervisors.",
    defaultEvent: "Mandatory Student Symposium: Wednesday, May 27, 2026 at Block-A Interactive Lab in collaborative sessions.",
    defaultNames: "Guest Speaker: Chief Security Architect, David Miller (CISSP)",
    suggestedTheme: "Cyber Awareness Cyberpunk Neon"
  },
  {
    id: "alumni",
    name: "🤝 Alumni Interaction",
    description: "Host career mentorships, reunions, and inspirational guest talks.",
    defaultTitle: "ILLUMINATED PATHWAYS: ALUMNI MASTERCLASS",
    defaultSubtitle: "From Woodland Corridors to Silicon Valley Tech Hubs",
    defaultContent: "Join us for an inspiring fireside chat on building world-class artificial intelligence models and the future of deep learning. Perfect for aspiring software architects, scientific thinkers, and tech designers.",
    defaultEvent: "Date: Saturday, May 23, 2026 | Time: 11:30 AM Onwards | Venue: Digital Multi-Media Room, Woodland campus.",
    defaultNames: "Alumnus Speaker: Elena Rostova (Staff Engineer at Google AI Studio)",
    suggestedTheme: "Academic Prestige Gold & Emerald"
  }
];

export const DEFAULT_POSTER: PosterData = {
  title: "WOODLAND OVERSEAS SCHOOL BRACE FOR THE FUTURE",
  subtitle: "Empowering Minds Through Exceptional Global Education Standard",
  mainContent: "Establishing pathways for modern innovation, creative arts, and world-class intelligence. Enroll your kids in our premier, immersive secondary academic programs designed to guide, challenge, and grow future leaders.",
  eventDetails: "Visit Woodland Campus North for information checklists. For enrollment support, dial our primary registrar lines +1-800-WOODLAND or apply directly at enrollment@woodland.pre",
  namesDesignations: "School Board of Trustees | Director: Mrs. Cynthia Woodland",
  design: {
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
    logoPosition: "top-center",
    layoutStyle: "elegant-card",
    backgroundStyle: "academic-shield",
    fontPairing: {
      headerFont: "Space Grotesk",
      bodyFont: "Inter",
      styleId: "academic"
    },
    decorations: ["stars", "borders"]
  }
};
