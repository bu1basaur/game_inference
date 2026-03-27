import { create } from "zustand";

interface GameState {
    isPaused: boolean;
    setPaused: (v: boolean) => void;
    currentScene: string | null;
    setScene: (name: string) => void;
}

export const useGameStore = create<GameState>((set) => ({
    isPaused: false,
    setPaused: (v) => set({ isPaused: v }),
    currentScene: null,
    setScene: (name) => set({ currentScene: name }),
}));
