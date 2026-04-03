"use client";

import { startTransition, useEffect, useState } from "react";

import {
  createOrder,
  loadStoreState,
  type MenuItemDraft,
  saveAccessibilitySettings,
  saveBusinessInfo,
  saveCustomizations,
  saveLanguages,
  savePaymentSettings,
  saveTemplateSelection,
  createMenuItem,
  createMenuItems,
  deleteMenuItem,
  toggleMenuItemSoldOut,
  updateOrderStatus
} from "@/lib/store/repository";
import {
  publishSyncMessage,
  subscribeToSyncMessages
} from "@/lib/sync/channel";
import type {
  AccessibilitySettings,
  CartItem,
  Customizations,
  KioskStore,
  OrderStatus,
  PaymentSettings,
  Surface,
  TemplateId
} from "@/lib/types";

export function useStoreSnapshot(surface: Surface) {
  const [store, setStore] = useState<KioskStore | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const refresh = () => {
      loadStoreState().then((data) => {
        if (!active) {
          return;
        }

        startTransition(() => {
          setStore(data);
          setIsLoading(false);
        });
      });
    };

    refresh();
    const unsubscribe = subscribeToSyncMessages((message) => {
      if (message.surface === surface) {
        return;
      }

      refresh();
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [surface]);

  async function updateAndSet(nextPromise: Promise<KioskStore>, eventName: string) {
    const next = await nextPromise;
    startTransition(() => {
      setStore(next);
    });
    publishSyncMessage(surface, eventName);
  }

  return {
    store,
    isLoading,
    saveBusinessInfo: async (
      business: Pick<KioskStore["business"], "name" | "type" | "greeting">
    ) => updateAndSet(saveBusinessInfo(business), "business.updated"),
    savePaymentSettings: async (payment: PaymentSettings) =>
      updateAndSet(savePaymentSettings(payment), "payment.updated"),
    saveAccessibilitySettings: async (accessibility: AccessibilitySettings) =>
      updateAndSet(saveAccessibilitySettings(accessibility), "settings.updated"),
    saveLanguages: async (languages: string[]) =>
      updateAndSet(saveLanguages(languages), "settings.updated"),
    saveTemplateSelection: async (templateId: TemplateId) =>
      updateAndSet(saveTemplateSelection(templateId), "template.updated"),
    saveCustomizations: async (customizations: Customizations) =>
      updateAndSet(saveCustomizations(customizations), "template.updated"),
    createMenuItem: async (draft: MenuItemDraft) =>
      updateAndSet(createMenuItem(draft), "menu.updated"),
    createMenuItems: async (drafts: MenuItemDraft[]) =>
      updateAndSet(createMenuItems(drafts), "menu.updated"),
    deleteMenuItem: async (itemId: string) =>
      updateAndSet(deleteMenuItem(itemId), "menu.updated"),
    toggleMenuItemSoldOut: async (itemId: string) =>
      updateAndSet(toggleMenuItemSoldOut(itemId), "menu.updated"),
    createOrder: async (
      cartItems: CartItem[],
      options?: {
        status?: OrderStatus;
        paymentId?: string;
        orderId?: string;
      }
    ) => updateAndSet(createOrder(cartItems, options), "orders.updated"),
    updateOrderStatus: async (orderId: string, status: OrderStatus) =>
      updateAndSet(updateOrderStatus(orderId, status), "orders.updated")
  };
}
