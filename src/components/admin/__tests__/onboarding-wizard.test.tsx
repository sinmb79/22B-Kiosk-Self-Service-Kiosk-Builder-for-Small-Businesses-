import React from "react";
import { render, screen } from "@testing-library/react";

import { OnboardingWizard } from "@/components/admin/onboarding-wizard";
import { createDefaultStore } from "@/lib/store/defaults";

describe("OnboardingWizard", () => {
  it("shows five setup steps and a launch action", () => {
    render(<OnboardingWizard store={createDefaultStore()} />);

    expect(screen.getByText("1. Business")).toBeInTheDocument();
    expect(screen.getByText("2. Design")).toBeInTheDocument();
    expect(screen.getByText("3. Menu")).toBeInTheDocument();
    expect(screen.getByText("4. Payment")).toBeInTheDocument();
    expect(screen.getByText("5. Launch")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /launch kiosk/i })
    ).toBeInTheDocument();
  });
});
