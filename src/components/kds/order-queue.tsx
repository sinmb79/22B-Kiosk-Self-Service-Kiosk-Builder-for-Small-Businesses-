"use client";

import type { Order, OrderStatus } from "@/lib/types";
import { formatWon } from "@/lib/utils";

type OrderQueueProps = {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => Promise<void> | void;
};

const statusOptions: OrderStatus[] = ["preparing", "ready", "done"];

export function OrderQueue({ orders, onUpdateStatus }: OrderQueueProps) {
  const visibleOrders = orders.filter((order) => order.status !== "done");

  return (
    <section className="grid gap-4 xl:grid-cols-2">
      {visibleOrders.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-white/10 px-6 py-12 text-center text-slate-300">
          No live orders. New kiosk orders will appear here.
        </div>
      ) : (
        visibleOrders.map((order) => (
          <article
            key={order.id}
            className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 text-white"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">
                  Order #{order.orderNumber}
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  {new Date(order.createdAt).toLocaleTimeString("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>
              </div>
              <span className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-100">
                {order.status}
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3"
                >
                  <p className="font-medium text-white">
                    {item.name} x {item.quantity}
                  </p>
                  <span className="text-sm text-slate-300">
                    {formatWon(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => onUpdateStatus(order.id, status)}
                  className="rounded-full border border-white/10 px-3 py-2 text-sm text-slate-100"
                >
                  {status[0].toUpperCase()}
                  {status.slice(1)}
                </button>
              ))}
            </div>
          </article>
        ))
      )}
    </section>
  );
}
