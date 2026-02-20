import { create } from "zustand";

interface GameState {
    isPaused: boolean;
    setPaused: (v: boolean) => void;
}

export const useGameStore = create<GameState>((set) => ({
    isPaused: false,
    setPaused: (v) => set({ isPaused: v }),
}));
