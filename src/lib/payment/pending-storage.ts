import type { PendingCheckout } from "@/lib/payment/checkout";

const STORAGE_KEY = "22b-kiosk.pending-checkouts";

function readStore() {
  if (typeof window === "undefined") {
    return {} as Record<string, PendingCheckout>;
  }

  const raw = sessionStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as Record<string, PendingCheckout>) : {};
}

function writeStore(value: Record<string, PendingCheckout>) {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

export function savePendingCheckout(checkout: PendingCheckout) {
  const store = readStore();
  writeStore({
    ...store,
    [checkout.orderId]: checkout
  });
}

export function readPendingCheckout(orderId: string) {
  const store = readStore();
  return store[orderId] ?? null;
}

export function clearPendingCheckout(orderId: string) {
  const store = readStore();
  delete store[orderId];
  writeStore(store);
}
