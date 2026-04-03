import type { TemplateManifest } from "@/lib/types";

const templates: TemplateManifest[] = [
  {
    id: "cafe-modern",
    name: "Cafe Modern",
    businessType: "cafe",
    description: "Bold hero header with bright menu cards for drinks-first brands.",
    palette: "Electric Blue",
    theme: {
      primary: "#22d3ee",
      secondary: "#1d4ed8",
      background: "#020617",
      surface: "#0f172a",
      text: "#f8fafc",
      accent: "#f59e0b"
    }
  },
  {
    id: "restaurant-classic",
    name: "Restaurant Classic",
    businessType: "restaurant",
    description: "Structured category rail and spacious plate cards for meals.",
    palette: "Brick & Cream",
    theme: {
      primary: "#fbbf24",
      secondary: "#7c2d12",
      background: "#111827",
      surface: "#1f2937",
      text: "#f9fafb",
      accent: "#f97316"
    }
  },
  {
    id: "bakery-natural",
    name: "Bakery Natural",
    businessType: "bakery",
    description: "Warm paper tones and editorial photography for daily bakes.",
    palette: "Warm Wheat",
    theme: {
      primary: "#fde68a",
      secondary: "#92400e",
      background: "#1c1917",
      surface: "#292524",
      text: "#fafaf9",
      accent: "#eab308"
    }
  }
];

export function getTemplates() {
  return templates;
}

export function getTemplateById(id: TemplateManifest["id"]) {
  return templates.find((template) => template.id === id) ?? templates[0];
}
