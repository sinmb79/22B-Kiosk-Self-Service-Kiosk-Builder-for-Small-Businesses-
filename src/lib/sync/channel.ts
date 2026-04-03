import type { Surface } from "@/lib/types";

export const SYNC_CHANNEL_NAME = "22b-kiosk-sync";

export type SyncMessage = {
  id: string;
  surface: Surface;
  type: string;
  timestamp: number;
};

export function createSyncMessage(surface: Surface, type: string): SyncMessage {
  return {
    id: crypto.randomUUID(),
    surface,
    type,
    timestamp: Date.now()
  };
}

export function publishSyncMessage(surface: Surface, type: string) {
  if (typeof window === "undefined" || !("BroadcastChannel" in window)) {
    return;
  }

  const channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
  channel.postMessage(createSyncMessage(surface, type));
  channel.close();
}

export function subscribeToSyncMessages(listener: (message: SyncMessage) => void) {
  if (typeof window === "undefined" || !("BroadcastChannel" in window)) {
    return () => undefined;
  }

  const channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
  channel.onmessage = (event: MessageEvent<SyncMessage>) => {
    listener(event.data);
  };

  return () => {
    channel.close();
  };
}
