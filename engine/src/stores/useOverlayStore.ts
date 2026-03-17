import { create } from "zustand";

type OverlayType = "calculator" | "inventory" | "board" | "receipt" | null;

interface OverlayState {
    overlay: OverlayType;
    openOverlay: (type: OverlayType) => void;
    closeOverlay: () => void;
}

export const useOverlayStore = create<OverlayState>((set) => ({
    overlay: null,

    openOverlay: (type) =>
        set({
            overlay: type,
        }),

    closeOverlay: () =>
        set({
            overlay: null,
        }),
}));
