import Link from "next/link";

import { getSurfaceLinks } from "@/lib/navigation";

export default function HomePage() {
  const surfaces = getSurfaceLinks();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#1d4ed8_0%,_#0f172a_35%,_#020617_100%)] px-6 py-12 text-slate-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <section className="max-w-3xl space-y-4">
          <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-slate-200">
            22B Kiosk Local MVP
          </span>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
            Small-business kiosk builder, running fully on one device.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Start with the admin setup, preview the kiosk flow, and watch live
            orders land in the kitchen queue without a backend.
          </p>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {surfaces.map((surface) => (
            <Link
              key={surface.href}
              href={surface.href}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:-translate-y-0.5 hover:border-cyan-300/40 hover:bg-white/10"
            >
              <div className="space-y-3">
                <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">
                  {surface.label}
                </p>
                <h2 className="text-2xl font-medium text-white">
                  {surface.href}
                </h2>
                <p className="text-sm leading-6 text-slate-300">
                  {surface.description}
                </p>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
