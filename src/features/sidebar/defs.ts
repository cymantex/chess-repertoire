export const SIDEBARS = {
  OPENING_EXPLORER: "OPENING_EXPLORER",
  SETTINGS: "SETTINGS",
} as const;

export type Sidebar = keyof typeof SIDEBARS;
