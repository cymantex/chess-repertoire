export const SIDEBAR_IDS = {
  OPENING_EXPLORER: "OPENING_EXPLORER",
  SETTINGS: "SETTINGS",
} as const;

export type SidebarId = keyof typeof SIDEBAR_IDS;
