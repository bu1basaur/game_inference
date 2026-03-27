import { create } from "zustand";
import { SaveData } from "../services/SaveService";

interface SaveStore {
    pendingLoad: SaveData | null;
    setPendingLoad: (data: SaveData) => void;
    clearPendingLoad: () => void;
}

export const useSaveStore = create<SaveStore>((set) => ({
    pendingLoad: null,
    setPendingLoad: (data) => set({ pendingLoad: data }),
    clearPendingLoad: () => set({ pendingLoad: null }),
}));
