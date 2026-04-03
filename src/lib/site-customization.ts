import type { Tables } from "@/integrations/supabase/types";

export type SiteThemeDefinition = {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  bg: string;
};

export type SectionColorConfig = {
  bg?: string | null;
  text?: string | null;
  accent?: string | null;
};

export type ResolvedSiteTheme = {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  background: string;
};

export const siteThemes: SiteThemeDefinition[] = [
  { id: "classico", name: "Clássico Dourado", primary: "#C9A96E", secondary: "#1A1A2E", bg: "#FFFDF5" },
  { id: "rosa", name: "Rosa Romance", primary: "#E8547A", secondary: "#F5C6D0", bg: "#FFF8F9" },
  { id: "azul", name: "Azul Noite", primary: "#2C3E6B", secondary: "#A8C4E0", bg: "#F0F4FA" },
  { id: "verde", name: "Verde Jardim", primary: "#3D8C40", secondary: "#A8D5A2", bg: "#F2FAF2" },
  { id: "boho", name: "Boho Bege", primary: "#A0826D", secondary: "#D4C4B0", bg: "#FAF5EF" },
  { id: "roxo", name: "Roxo Místico", primary: "#6B3FA0", secondary: "#C8A2E8", bg: "#F8F2FF" },
  { id: "lilas", name: "Lilás Elegante", primary: "#9b75c1", secondary: "#72489b", bg: "#FFFFFF" },
];

export const defaultSiteSections: Record<string, boolean> = {
  hero: true,
  countdown: true,
  story: true,
  gallery: true,
  info: true,
  rsvp: true,
  gifts: true,
  location: true,
  message: true,
  footer: true,
  playlist: true,
  wall: true,
};

const darkSections = new Set(["hero", "gallery", "playlist", "gifts", "message", "footer"]);

const normalizeHex = (color: string) => {
  const value = color.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(value)) return value;
  if (/^#[0-9a-fA-F]{3}$/.test(value)) {
    return `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`;
  }
  return value;
};

const hexToRgb = (color: string) => {
  const normalized = normalizeHex(color);
  if (!/^#[0-9a-fA-F]{6}$/.test(normalized)) return null;
  const int = Number.parseInt(normalized.slice(1), 16);
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  };
};

const toLinear = (channel: number) => {
  const normalized = channel / 255;
  return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
};

const relativeLuminance = (color: string) => {
  const rgb = hexToRgb(color);
  if (!rgb) return 0;
  return 0.2126 * toLinear(rgb.r) + 0.7152 * toLinear(rgb.g) + 0.0722 * toLinear(rgb.b);
};

const contrastRatio = (background: string, foreground: string) => {
  const bg = relativeLuminance(background);
  const fg = relativeLuminance(foreground);
  const lighter = Math.max(bg, fg);
  const darker = Math.min(bg, fg);
  return (lighter + 0.05) / (darker + 0.05);
};

type ThemeSource = Pick<Tables<"events">, "theme" | "color_primary" | "color_secondary">;

export function resolveSiteTheme(event?: Partial<ThemeSource> | null): ResolvedSiteTheme {
  const baseTheme = siteThemes.find((theme) => theme.id === event?.theme) ?? siteThemes[0];

  return {
    id: baseTheme.id,
    name: baseTheme.name,
    primary: event?.color_primary || baseTheme.primary,
    secondary: event?.color_secondary || baseTheme.secondary,
    background: baseTheme.bg,
  };
}

export function resolveSiteSections(sections: Tables<"events">["sections"] | null | undefined) {
  if (!sections || typeof sections !== "object" || Array.isArray(sections)) {
    return { ...defaultSiteSections };
  }

  return {
    ...defaultSiteSections,
    ...(sections as Record<string, boolean>),
  };
}

export function resolveSectionColors(sectionColors: Tables<"events">["section_colors"] | null | undefined) {
  if (!sectionColors || typeof sectionColors !== "object" || Array.isArray(sectionColors)) {
    return {} as Record<string, SectionColorConfig>;
  }

  return sectionColors as Record<string, SectionColorConfig>;
}

export function getSectionPalette(
  sectionId: string,
  theme: ResolvedSiteTheme,
  sectionColors: Record<string, SectionColorConfig> = {}
) {
  const overrides = sectionColors[sectionId] || {};
  const isDark = darkSections.has(sectionId);

  return {
    bg: overrides.bg || (isDark ? theme.secondary : theme.background),
    text: overrides.text || (isDark ? theme.background : theme.secondary),
    accent: overrides.accent || theme.primary,
    isDark,
  };
}

export function withAlpha(color: string, alpha: string) {
  const normalized = normalizeHex(color);
  return /^#[0-9a-fA-F]{6}$/.test(normalized) ? `${normalized}${alpha}` : color;
}

export function getReadableTextColor(background: string, light: string = "#FFFFFF", dark: string = "#111111") {
  return contrastRatio(background, dark) >= contrastRatio(background, light) ? dark : light;
}