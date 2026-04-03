"use client";

import { type ChangeEvent, useMemo, useState } from "react";

import { TemplateGallery } from "@/components/admin/template-gallery";
import { TemplateRenderer } from "@/components/kiosk/template-renderer";
import { getTemplates } from "@/lib/templates";
import type { Customizations, KioskStore, TemplateId } from "@/lib/types";

type DesignStudioProps = {
  store: KioskStore;
  onSaveTemplateSelection?: (templateId: TemplateId) => Promise<void> | void;
  onSaveCustomizations?: (customizations: Customizations) => Promise<void> | void;
};

const colorPresets = [
  { primary: "#22d3ee", accent: "#f59e0b", label: "Ocean" },
  { primary: "#10b981", accent: "#fb7185", label: "Fresh" },
  { primary: "#f97316", accent: "#facc15", label: "Warm" },
  { primary: "#8b5cf6", accent: "#f43f5e", label: "Neon" },
  { primary: "#111827", accent: "#38bdf8", label: "Ink" }
] as const;

export function DesignStudio({
  store,
  onSaveTemplateSelection,
  onSaveCustomizations
}: DesignStudioProps) {
  const templates = getTemplates();
  const initialTemplate =
    templates.find((template) => template.id === store.templateId) ?? templates[0];
  const [selectedTemplateId, setSelectedTemplateId] = useState<TemplateId>(
    store.templateId
  );
  const [previewCategoryId, setPreviewCategoryId] = useState(
    store.categories[0]?.id ?? ""
  );
  const [primaryColor, setPrimaryColor] = useState(
    store.customizations.colors?.primary ?? initialTemplate.theme.primary
  );
  const [accentColor, setAccentColor] = useState(
    store.customizations.colors?.accent ?? initialTemplate.theme.accent
  );
  const [greeting, setGreeting] = useState(
    store.customizations.greeting ?? store.business.greeting
  );
  const [logo, setLogo] = useState(store.customizations.logo ?? "");
  const [backgroundImage, setBackgroundImage] = useState(
    store.customizations.backgroundImage ?? ""
  );
  const [isSaving, setIsSaving] = useState(false);

  const previewCustomizations = useMemo<Customizations>(
    () => ({
      ...store.customizations,
      level: 1,
      greeting: greeting.trim() || undefined,
      logo: logo.trim() || undefined,
      backgroundImage: backgroundImage.trim() || undefined,
      colors: {
        ...store.customizations.colors,
        primary: normalizeHex(primaryColor),
        accent: normalizeHex(accentColor)
      }
    }),
    [
      accentColor,
      backgroundImage,
      greeting,
      logo,
      primaryColor,
      store.customizations
    ]
  );

  async function handleSave() {
    setIsSaving(true);

    try {
      await onSaveCustomizations?.(previewCustomizations);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleTemplateSelect(templateId: TemplateId) {
    setSelectedTemplateId(templateId);
    await onSaveTemplateSelection?.(templateId);
  }

  async function handleLogoFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setLogo(await readFileAsDataUrl(file));
  }

  return (
    <section className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6">
      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">
            Lv.1 customization
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Design studio</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            Adjust brand color, greeting, and logo locally. The preview below
            reuses the same renderer as the kiosk screen, so what you see here
            is what customers get.
          </p>
        </div>

        <TemplateGallery
          selectedId={selectedTemplateId}
          templates={templates}
          onSelect={handleTemplateSelect}
        />

        <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-5 rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Brand controls</h3>
                <span className="rounded-full border border-cyan-300/30 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-100">
                  live
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-5">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setPrimaryColor(preset.primary);
                      setAccentColor(preset.accent);
                    }}
                    className="rounded-2xl border border-white/10 px-3 py-3 text-left text-xs text-slate-200"
                    style={{
                      background: `linear-gradient(135deg, ${preset.primary}, ${preset.accent})`
                    }}
                  >
                    <span className="rounded-full bg-black/40 px-2 py-1">
                      {preset.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_auto]">
              <label className="space-y-2 text-sm text-slate-200">
                Primary color
                <input
                  aria-label="Primary color"
                  value={primaryColor}
                  onChange={(event) => setPrimaryColor(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-200">
                Primary swatch
                <input
                  aria-label="Primary swatch"
                  type="color"
                  value={coerceColorValue(primaryColor)}
                  onChange={(event) => setPrimaryColor(event.target.value)}
                  className="h-[52px] w-20 rounded-2xl border border-white/10 bg-slate-900 p-2"
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_auto]">
              <label className="space-y-2 text-sm text-slate-200">
                Accent color
                <input
                  aria-label="Accent color"
                  value={accentColor}
                  onChange={(event) => setAccentColor(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-200">
                Accent swatch
                <input
                  aria-label="Accent swatch"
                  type="color"
                  value={coerceColorValue(accentColor)}
                  onChange={(event) => setAccentColor(event.target.value)}
                  className="h-[52px] w-20 rounded-2xl border border-white/10 bg-slate-900 p-2"
                />
              </label>
            </div>

            <label className="block space-y-2 text-sm text-slate-200">
              Greeting override
              <textarea
                aria-label="Greeting override"
                value={greeting}
                onChange={(event) => setGreeting(event.target.value)}
                rows={3}
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
              />
            </label>

            <label className="block space-y-2 text-sm text-slate-200">
              Logo URL
              <input
                aria-label="Logo URL"
                value={logo}
                onChange={(event) => setLogo(event.target.value)}
                placeholder="https://example.com/logo.png"
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
              />
            </label>

            <label className="block space-y-2 text-sm text-slate-200">
              Logo upload
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoFileChange}
                className="block w-full rounded-2xl border border-dashed border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-300"
              />
            </label>

            <label className="block space-y-2 text-sm text-slate-200">
              Background image URL
              <input
                aria-label="Background image URL"
                value={backgroundImage}
                onChange={(event) => setBackgroundImage(event.target.value)}
                placeholder="https://example.com/wallpaper.jpg"
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
              />
            </label>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="w-full rounded-2xl bg-cyan-400 px-4 py-3 font-medium text-slate-950 transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save design settings"}
            </button>
          </div>

          <section
            aria-label="Design preview"
            className="space-y-4 rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5"
          >
            <div>
              <h3 className="text-lg font-semibold text-white">Live preview</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Tap categories and watch the kiosk theme update before you save.
              </p>
            </div>

            <TemplateRenderer
              templateId={selectedTemplateId}
              business={store.business}
              categories={store.categories}
              items={store.items}
              customizations={previewCustomizations}
              activeCategoryId={previewCategoryId || store.categories[0]?.id || ""}
              onSelectCategory={setPreviewCategoryId}
              onAddItem={() => undefined}
            />
          </section>
        </div>
      </div>
    </section>
  );
}

function normalizeHex(value: string) {
  const trimmed = value.trim();
  return /^#[0-9a-f]{6}$/i.test(trimmed) ? trimmed.toLowerCase() : trimmed;
}

function coerceColorValue(value: string) {
  return /^#[0-9a-f]{6}$/i.test(value.trim()) ? value : "#2563eb";
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Unable to read the logo file."));
    };

    reader.onerror = () => {
      reject(new Error("Unable to read the logo file."));
    };

    reader.readAsDataURL(file);
  });
}
