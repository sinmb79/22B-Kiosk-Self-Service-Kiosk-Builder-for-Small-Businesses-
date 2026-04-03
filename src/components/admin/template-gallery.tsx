"use client";

import type { TemplateManifest, TemplateId } from "@/lib/types";
import { cn } from "@/lib/utils";

type TemplateGalleryProps = {
  selectedId: TemplateId;
  templates: TemplateManifest[];
  onSelect?: (templateId: TemplateId) => void;
};

export function TemplateGallery({
  selectedId,
  templates,
  onSelect
}: TemplateGalleryProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {templates.map((template) => {
        const isSelected = template.id === selectedId;

        return (
          <button
            key={template.id}
            type="button"
            onClick={() => onSelect?.(template.id)}
            className={cn(
              "rounded-3xl border p-5 text-left transition",
              isSelected
                ? "border-cyan-300 bg-cyan-500/10"
                : "border-white/10 bg-white/5 hover:border-white/25"
            )}
          >
            <div className="mb-4 h-24 rounded-2xl bg-[linear-gradient(135deg,_rgba(37,99,235,0.75),_rgba(15,23,42,0.8),_rgba(251,191,36,0.55))]" />
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                {template.palette}
              </p>
              <h3 className="text-xl font-medium text-white">{template.name}</h3>
              <p className="text-sm leading-6 text-slate-300">
                {template.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
