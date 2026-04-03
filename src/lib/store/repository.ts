import { createDefaultStore } from "@/lib/store/defaults";
import { getDb } from "@/lib/store/db";
import type {
  AccessibilitySettings,
  CartItem,
  Customizations,
  KioskStore,
  MenuItem,
  OrderStatus,
  PaymentSettings,
  TemplateId
} from "@/lib/types";

const SNAPSHOT_ID = "local" as const;

export type MenuItemDraft = Pick<
  MenuItem,
  "categoryId" | "name" | "price" | "description" | "nameEn" | "nameZh" | "nameJa"
>;

export async function loadStoreState(): Promise<KioskStore> {
  const db = getDb();
  const snapshot = await db.snapshots.get(SNAPSHOT_ID);

  if (snapshot) {
    return snapshot.data;
  }

  const initial = createDefaultStore();
  await saveStoreState(initial);
  return initial;
}

export async function saveStoreState(data: KioskStore): Promise<void> {
  const db = getDb();
  await db.snapshots.put({
    id: SNAPSHOT_ID,
    data,
    updatedAt: new Date().toISOString()
  });
}

export async function updateStoreState(
  updater: (current: KioskStore) => KioskStore
): Promise<KioskStore> {
  const current = await loadStoreState();
  const next = updater(current);
  await saveStoreState(next);
  return next;
}

export async function clearStoreState(): Promise<void> {
  const db = getDb();
  await db.snapshots.clear();
}

export async function saveBusinessInfo(
  business: Pick<KioskStore["business"], "name" | "type" | "greeting">
) {
  return updateStoreState((current) => ({
    ...current,
    business: {
      ...current.business,
      ...business
    }
  }));
}

export async function savePaymentSettings(payment: PaymentSettings) {
  return updateStoreState((current) => ({
    ...current,
    settings: {
      ...current.settings,
      payment
    }
  }));
}

export async function saveAccessibilitySettings(
  accessibility: AccessibilitySettings
) {
  return updateStoreState((current) => ({
    ...current,
    settings: {
      ...current.settings,
      accessibility
    }
  }));
}

export async function saveLanguages(languages: string[]) {
  return updateStoreState((current) => ({
    ...current,
    settings: {
      ...current.settings,
      languages
    }
  }));
}

export async function saveTemplateSelection(templateId: TemplateId) {
  return updateStoreState((current) => ({
    ...current,
    templateId
  }));
}

export async function saveCustomizations(customizations: Customizations) {
  return updateStoreState((current) => ({
    ...current,
    customizations: {
      ...current.customizations,
      ...customizations,
      colors: {
        ...current.customizations.colors,
        ...customizations.colors
      }
    }
  }));
}

export async function createMenuItem(draft: MenuItemDraft) {
  return createMenuItems([draft]);
}

export async function createMenuItems(drafts: MenuItemDraft[]) {
  return updateStoreState((current) => {
    const nextItems = drafts
      .filter((draft) => draft.name.trim() && draft.price > 0)
      .map((draft, index) => createMenuItemRecord(draft, current.items.length + index));

    return {
      ...current,
      items: [...current.items, ...nextItems]
    };
  });
}

export async function deleteMenuItem(itemId: string) {
  return updateStoreState((current) => ({
    ...current,
    items: current.items.filter((item) => item.id !== itemId)
  }));
}

export async function toggleMenuItemSoldOut(itemId: string) {
  return updateStoreState((current) => ({
    ...current,
    items: current.items.map((item) =>
      item.id === itemId ? { ...item, soldOut: !item.soldOut } : item
    )
  }));
}

export async function createOrder(
  cartItems: CartItem[],
  options?: {
    status?: OrderStatus;
    paymentId?: string;
    orderId?: string;
  }
) {
  return updateStoreState((current) => {
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    return {
      ...current,
      orders: [
        {
          id: options?.orderId ?? crypto.randomUUID(),
          orderNumber: current.orders.length + 1,
          items: cartItems,
          totalPrice,
          status: options?.status ?? "pending",
          paymentId: options?.paymentId,
          createdAt: new Date().toISOString()
        },
        ...current.orders
      ]
    };
  });
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  return updateStoreState((current) => ({
    ...current,
    orders: current.orders.map((order) =>
      order.id === orderId ? { ...order, status } : order
    )
  }));
}

function createMenuItemId(name: string) {
  return `${name
    .trim()
    .toLowerCase()
    .replaceAll(/\s+/g, "-")
    .replaceAll(/[^a-z0-9-]/g, "")}-${crypto.randomUUID()}`;
}

function createMenuItemRecord(draft: MenuItemDraft, index: number): MenuItem {
  return {
    id: createMenuItemId(draft.name),
    categoryId: draft.categoryId,
    name: draft.name,
    nameEn: draft.nameEn,
    nameZh: draft.nameZh,
    nameJa: draft.nameJa,
    price: draft.price,
    description: draft.description,
    soldOut: false,
    sortOrder: index + 1
  };
}
