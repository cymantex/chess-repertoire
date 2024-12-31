import type { ChessRepertoireStore, SetState } from "@/app/zustand/store.ts";
import type { SidebarId } from "@/features/sidebar/defs.ts";
import { SIDEBAR_IDS } from "@/features/sidebar/defs.ts";
import { COLLAPSED_SIDEBAR_SIZE, OPEN_SIDEBAR_SIZE } from "@/app/defs.ts";
import { getNonReactiveState } from "@/app/zustand/utils.ts";

export interface SidebarSlice {
  id: SidebarId;
  open: (id: SidebarId) => void;
  isOpen: boolean;
  size: number;
  toggle: () => void;
}

export const createSidebarSlice = (set: SetState): SidebarSlice => ({
  id: SIDEBAR_IDS.OPENING_EXPLORER,
  open: (id) => updateSidebarState(set, { id }),
  isOpen: true,
  size: OPEN_SIDEBAR_SIZE,
  toggle: () => {
    const isOpen = selectSidebarIsOpen(getNonReactiveState());

    return updateSidebarState(set, {
      isOpen: !isOpen,
      size: isOpen ? COLLAPSED_SIDEBAR_SIZE : OPEN_SIDEBAR_SIZE,
    });
  },
});

const updateSidebarState = (
  set: SetState,
  sidebarSlice: Partial<SidebarSlice>,
) =>
  set({
    sidebar: {
      ...getNonReactiveState().sidebar,
      ...sidebarSlice,
    },
  });

export const selectSidebarId = (state: ChessRepertoireStore) =>
  state.sidebar.id;
export const selectOpenSidebar = (state: ChessRepertoireStore) =>
  state.sidebar.open;
export const selectSidebarIsOpen = (state: ChessRepertoireStore) =>
  state.sidebar.isOpen;
export const selectSidebarSize = (state: ChessRepertoireStore) =>
  state.sidebar.size;
export const selectToggleSidebar = (state: ChessRepertoireStore) =>
  state.sidebar.toggle;
