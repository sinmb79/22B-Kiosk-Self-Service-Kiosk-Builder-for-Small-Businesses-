"use client";

import Link from "next/link";

import { CsvImportPanel } from "@/components/admin/csv-import-panel";
import { MenuEditor } from "@/components/admin/menu-editor";
import { PhotoImportPanel } from "@/components/admin/photo-import-panel";
import type { OcrExtractionResult } from "@/lib/ocr/extract-menu";
import { useStoreSnapshot } from "@/lib/store/use-store-snapshot";

export default function AdminMenuPage() {
  const {
    store,
    isLoading,
    createMenuItem,
    createMenuItems,
    deleteMenuItem,
    toggleMenuItemSoldOut
  } = useStoreSnapshot("admin");

  if (isLoading || !store) {
    return <main className="p-8 text-white">Loading menu editor...</main>;
  }

  async function handleRunOcr(payload: {
    imageUrl?: string;
    imageDataUrl?: string;
    provider: "openai" | "anthropic" | "google";
    apiKey?: string;
  }): Promise<OcrExtractionResult> {
    const response = await fetch("/api/ocr/menu", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const json = (await response.json()) as OcrExtractionResult & {
      message?: string;
    };

    if (!response.ok) {
      throw new Error(json.message ?? "Unable to run OCR.");
    }

    return json;
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <Link href="/admin" className="text-sm text-cyan-200">
            ← Back to admin
          </Link>
          <Link href="/admin/onboarding" className="text-sm text-cyan-200">
            Open setup wizard
          </Link>
        </div>
        <PhotoImportPanel
          categories={store.categories}
          onRunOcr={handleRunOcr}
          onImportItems={createMenuItems}
        />
        <CsvImportPanel
          categories={store.categories}
          onImportItems={createMenuItems}
        />
        <MenuEditor
          categories={store.categories}
          items={store.items}
          onCreateItem={createMenuItem}
          onDeleteItem={deleteMenuItem}
          onToggleSoldOut={toggleMenuItemSoldOut}
        />
      </div>
    </main>
  );
}
