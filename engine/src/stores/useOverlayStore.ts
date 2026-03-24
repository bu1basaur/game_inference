import { create } from "zustand";

type OverlayType =
    | "calculator"
    | "inventory"
    | "board"
    | "receipt"
    | "note"
    | null;

export interface OverlayData {
    imageKey?: string;
}

interface OverlayState {
    overlay: OverlayType;
    overlayData?: OverlayData;
    openOverlay: (type: OverlayType, data?: OverlayData) => void;
    closeOverlay: () => void;
}

export const useOverlayStore = create<OverlayState>((set) => ({
    overlay: null,
    overlayData: undefined,

    openOverlay: (type, data) => set({ overlay: type, overlayData: data }),
    closeOverlay: () => set({ overlay: null, overlayData: undefined }),
}));
