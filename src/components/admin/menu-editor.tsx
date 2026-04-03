"use client";

import { useState } from "react";

import type { Category, MenuItem } from "@/lib/types";
import { formatWon } from "@/lib/utils";

type MenuEditorProps = {
  categories: Category[];
  items: MenuItem[];
  onCreateItem: (draft: {
    categoryId: string;
    name: string;
    price: number;
    description?: string;
  }) => Promise<void> | void;
  onDeleteItem: (itemId: string) => Promise<void> | void;
  onToggleSoldOut: (itemId: string) => Promise<void> | void;
};

export function MenuEditor({
  categories,
  items,
  onCreateItem,
  onDeleteItem,
  onToggleSoldOut
}: MenuEditorProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [description, setDescription] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const numericPrice = Number(price);

    if (!name.trim() || Number.isNaN(numericPrice) || numericPrice <= 0) {
      return;
    }

    await onCreateItem({
      categoryId,
      name: name.trim(),
      price: numericPrice,
      description: description.trim() || undefined
    });

    setName("");
    setPrice("");
    setDescription("");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <form
        onSubmit={handleSubmit}
        className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6"
      >
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-white">Add a menu item</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Use this editor to keep the kiosk and KDS in sync from one source
              of truth.
            </p>
          </div>

          <label className="block space-y-2 text-sm text-slate-200">
            Name
            <input
              aria-label="Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
            />
          </label>

          <label className="block space-y-2 text-sm text-slate-200">
            Price
            <input
              aria-label="Price"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              inputMode="numeric"
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
            />
          </label>

          <label className="block space-y-2 text-sm text-slate-200">
            Category
            <select
              aria-label="Category"
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.emoji} {category.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-2 text-sm text-slate-200">
            Description
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-2xl bg-cyan-400 px-4 py-3 font-medium text-slate-950 transition hover:bg-cyan-300"
          >
            Add item
          </button>
        </div>
      </form>

      <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Current menu</h2>
            <p className="mt-2 text-sm text-slate-300">
              {items.length} items across {categories.length} categories
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {items
            .slice()
            .sort((left, right) => left.sortOrder - right.sortOrder)
            .map((item) => (
              <article
                key={item.id}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-slate-400">
                      {
                        categories.find((category) => category.id === item.categoryId)
                          ?.name
                      }
                    </p>
                    <h3 className="text-xl font-medium text-white">{item.name}</h3>
                    <p className="text-sm text-slate-300">
                      {item.description ?? "설명이 아직 없습니다."}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-100">
                      {formatWon(item.price)}
                    </span>
                    <button
                      type="button"
                      onClick={() => onToggleSoldOut(item.id)}
                      className="rounded-full border border-amber-300/30 px-3 py-1 text-sm text-amber-100"
                    >
                      {item.soldOut ? "Mark available" : "Mark sold out"}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteItem(item.id)}
                      className="rounded-full border border-rose-300/30 px-3 py-1 text-sm text-rose-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
        </div>
      </div>
    </div>
  );
}
