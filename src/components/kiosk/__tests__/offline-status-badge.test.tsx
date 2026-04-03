import React from "react";
import { render, screen } from "@testing-library/react";

import { OfflineStatusBadge } from "@/components/kiosk/offline-status-badge";

describe("OfflineStatusBadge", () => {
  it("renders the current offline message", () => {
    render(<OfflineStatusBadge online={false} />);

    expect(screen.getByText("Offline mode")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Menu browsing stays available, but card payment needs a network connection."
      )
    ).toBeInTheDocument();
  });
});
