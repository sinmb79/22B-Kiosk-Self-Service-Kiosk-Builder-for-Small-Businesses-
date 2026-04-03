import { getTemplateById } from "@/lib/templates";
import type {
  BusinessInfo,
  Customizations,
  TemplateId,
  ThemeColors
} from "@/lib/types";

export type BrandPresentation = {
  colors: ThemeColors;
  greeting: string;
  logo?: string;
  backgroundImage?: string;
};

export function resolveBrandPresentation(
  templateId: TemplateId,
  business: BusinessInfo,
  customizations?: Customizations
): BrandPresentation {
  const template = getTemplateById(templateId);
  const colors = {
    ...template.theme,
    ...customizations?.colors
  };

  return {
    colors,
    greeting: customizations?.greeting?.trim() || business.greeting,
    logo: customizations?.logo || business.logo,
    backgroundImage: customizations?.backgroundImage
  };
}

export function hexToRgba(value: string, alpha: number) {
  const normalized = value.trim().replace("#", "");

  if (!/^[0-9a-f]{6}$/i.test(normalized)) {
    return value;
  }

  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export function applyHighContrastTheme(colors: ThemeColors): ThemeColors {
  return {
    ...colors,
    primary: "#facc15",
    secondary: "#0f172a",
    background: "#020617",
    surface: "#000000",
    text: "#ffffff",
    accent: "#38bdf8"
  };
}
