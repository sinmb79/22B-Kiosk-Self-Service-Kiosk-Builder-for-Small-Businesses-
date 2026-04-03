"use client";

import { useEffect, useMemo, useState } from "react";

import { CartPanel } from "@/components/kiosk/cart-panel";
import { OfflineStatusBadge } from "@/components/kiosk/offline-status-badge";
import { PaymentCheckoutPanel } from "@/components/kiosk/payment-checkout-panel";
import { speakText } from "@/lib/accessibility/voice-guide";
import {
  coerceLanguage,
  getLocalizedItemName,
  getMessages,
  type SupportedLanguage
} from "@/lib/i18n";
import type { PendingCheckout } from "@/lib/payment/checkout";
import { registerKioskServiceWorker } from "@/lib/offline/register-service-worker";
import { savePendingCheckout } from "@/lib/payment/pending-storage";
import { requestTossCardPayment } from "@/lib/payment/toss";
import { TemplateRenderer } from "@/components/kiosk/template-renderer";
import { useStoreSnapshot } from "@/lib/store/use-store-snapshot";
import type { CartItem, MenuItem } from "@/lib/types";

function createCartKey(item: MenuItem) {
  return `${item.id}-${Date.now()}`;
}

export default function KioskPage() {
  const { store, isLoading, createOrder } = useStoreSnapshot("kiosk");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [online, setOnline] = useState(true);

  const activeCategoryId = useMemo(
    () => store?.categories[0]?.id ?? "",
    [store?.categories]
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState(activeCategoryId);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>("ko");

  useEffect(() => {
    setOnline(window.navigator.onLine);
    void registerKioskServiceWorker();

    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!store) {
      return;
    }

    const allowedLanguages = store.settings.languages.map(coerceLanguage);
    const fallbackLanguage = allowedLanguages[0] ?? "ko";

    setSelectedLanguage((current) =>
      allowedLanguages.includes(current) ? current : fallbackLanguage
    );
  }, [store]);

  if (isLoading || !store) {
    return <main className="p-8 text-white">Loading kiosk...</main>;
  }

  const accessibility = store.settings.accessibility;
  const currentCategoryId = selectedCategoryId || store.categories[0]?.id || "";
  const allowedLanguages = store.settings.languages.map(coerceLanguage);
  const messages = getMessages(selectedLanguage);

  useEffect(() => {
    if (!accessibility.voiceGuide) {
      return;
    }

    speakText(
      store.customizations.greeting ?? store.business.greeting,
      selectedLanguage
    );
  }, [
    accessibility.voiceGuide,
    selectedLanguage,
    store.business.greeting,
    store.customizations.greeting
  ]);

  function handleAddItem(item: MenuItem) {
    const localizedName = getLocalizedItemName(item, selectedLanguage);

    setCart((current) => {
      const existing = current.find((cartItem) => cartItem.menuItemId === item.id);

      if (existing) {
        return current.map((cartItem) =>
          cartItem.menuItemId === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }

      return [
        ...current,
        {
          id: createCartKey(item),
          menuItemId: item.id,
          name: localizedName,
          quantity: 1,
          price: item.price
        }
      ];
    });

    if (accessibility.voiceGuide) {
      speakText(localizedName, selectedLanguage);
    }
  }

  async function handlePlaceOrder() {
    if (cart.length === 0) {
      return;
    }

    await createOrder(cart);
    setCart([]);

    if (accessibility.voiceGuide) {
      speakText(messages.queueUnpaidOrder, selectedLanguage);
    }
  }

  async function handleDemoPayment(checkout: PendingCheckout) {
    await createOrder(checkout.items, {
      status: "paid",
      paymentId: `demo_${checkout.orderId}`,
      orderId: checkout.orderId
    });
    setCart([]);

    if (accessibility.voiceGuide) {
      speakText(messages.completeDemoPayment, selectedLanguage);
    }
  }

  async function handleLivePayment(checkout: PendingCheckout) {
    const clientKey = store?.settings.payment.clientKey;

    if (!clientKey) {
      return;
    }

    savePendingCheckout(checkout);

    const origin = window.location.origin;

    await requestTossCardPayment({
      clientKey,
      checkout,
      successUrl: `${origin}/kiosk/payment/result`,
      failUrl: `${origin}/kiosk/payment/result`
    });

    if (accessibility.voiceGuide) {
      speakText(messages.openTossPayment, selectedLanguage);
    }
  }

  function handleLanguageChange(language: SupportedLanguage) {
    setSelectedLanguage(language);

    if (accessibility.voiceGuide) {
      speakText(language.toUpperCase(), language);
    }
  }

  return (
    <main
      className={`min-h-screen px-6 py-10 text-white ${
        accessibility.highContrast ? "bg-black" : "bg-slate-950"
      }`}
    >
      {store.customizations.cssOverride ? (
        <style>{store.customizations.cssOverride}</style>
      ) : null}
      <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[1.1fr_0.45fr]">
        <div className="space-y-4">
          {allowedLanguages.length > 1 ? (
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-4 text-white">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">
                  {messages.language}
                </p>
                <div className="flex flex-wrap gap-2">
                  {allowedLanguages.map((language) => (
                    <button
                      key={language}
                      type="button"
                      onClick={() => handleLanguageChange(language)}
                      className={
                        language === selectedLanguage
                          ? "rounded-full bg-cyan-300 px-4 py-2 text-sm font-medium text-slate-950"
                          : "rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200"
                      }
                    >
                      {language.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          ) : null}

          <TemplateRenderer
            templateId={store.templateId}
            business={store.business}
            categories={store.categories}
            items={store.items}
            locale={selectedLanguage}
            accessibility={accessibility}
            customizations={store.customizations}
            activeCategoryId={currentCategoryId}
            onSelectCategory={setSelectedCategoryId}
            onAddItem={handleAddItem}
          />
        </div>
        <div className="space-y-6">
          <OfflineStatusBadge
            online={online}
            locale={selectedLanguage}
            largeText={accessibility.largeText}
          />
          <CartPanel
            items={cart}
            onSubmit={handlePlaceOrder}
            submitLabel={messages.queueUnpaidOrder}
            locale={selectedLanguage}
            largeText={accessibility.largeText}
            simpleMode={accessibility.simpleMode}
          />
          <PaymentCheckoutPanel
            items={cart}
            payment={store.settings.payment}
            onDemoPayment={handleDemoPayment}
            onLivePayment={handleLivePayment}
            locale={selectedLanguage}
            largeText={accessibility.largeText}
            simpleMode={accessibility.simpleMode}
          />
        </div>
      </div>
    </main>
  );
}
