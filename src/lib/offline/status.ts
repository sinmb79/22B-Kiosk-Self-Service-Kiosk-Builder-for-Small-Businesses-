export function describeOfflineCapabilities(online: boolean) {
  if (online) {
    return {
      title: "Online",
      detail: "Live payment is available and kiosk data will sync immediately."
    };
  }

  return {
    title: "Offline mode",
    detail:
      "Menu browsing stays available, but card payment needs a network connection."
  };
}
