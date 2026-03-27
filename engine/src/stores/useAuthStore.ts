import { create } from "zustand";

const STORAGE_KEY = "player_name";

interface AuthState {
    uid: string | null;
    name: string;
    setUid: (uid: string) => void;
    setName: (name: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    uid: null,
    name: localStorage.getItem(STORAGE_KEY) ?? "",
    setUid: (uid) => set({ uid }),
    setName: (name) => {
        localStorage.setItem(STORAGE_KEY, name);
        set({ name });
    },
}));

