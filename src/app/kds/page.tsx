"use client";

import { OrderQueue } from "@/components/kds/order-queue";
import { useStoreSnapshot } from "@/lib/store/use-store-snapshot";

export default function KdsPage() {
  const { store, isLoading, updateOrderStatus } = useStoreSnapshot("kds");

  if (isLoading || !store) {
    return <main className="p-8 text-white">Loading KDS...</main>;
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="rounded-[2rem] border border-white/10 bg-[linear-gradient(160deg,_rgba(6,182,212,0.2),_rgba(2,6,23,0.95))] p-8">
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">
            Kitchen Display
          </p>
          <h1 className="mt-3 text-4xl font-semibold">Live order queue</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-200">
            Orders placed on the kiosk appear here without a backend. Status
            changes flow back through the same local data layer.
          </p>
        </header>

        <OrderQueue orders={store.orders} onUpdateStatus={updateOrderStatus} />
      </div>
    </main>
  );
}
