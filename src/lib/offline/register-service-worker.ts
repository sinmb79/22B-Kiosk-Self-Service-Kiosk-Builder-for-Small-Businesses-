"use client";

export async function registerKioskServiceWorker() {
  if (
    typeof window === "undefined" ||
    !("serviceWorker" in navigator) ||
    process.env.NODE_ENV !== "production"
  ) {
    return null;
  }

  return navigator.serviceWorker.register("/sw.js");
}
