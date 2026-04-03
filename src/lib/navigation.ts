export type SurfaceLink = {
  href: "/admin" | "/kiosk" | "/kds";
  label: string;
  description: string;
};

const SURFACE_LINKS: SurfaceLink[] = [
  {
    href: "/admin",
    label: "Admin",
    description: "Template setup, menu editing, and launch controls."
  },
  {
    href: "/kiosk",
    label: "Kiosk",
    description: "Customer ordering experience with template rendering."
  },
  {
    href: "/kds",
    label: "KDS",
    description: "Kitchen queue, status toggles, and service timing."
  }
];

export function getSurfaceLinks(): SurfaceLink[] {
  return SURFACE_LINKS;
}
