import { create } from "zustand";

export type WorkLogEntry = {
    id: number;
    time: string;   // "HH:MM" 형식
    content: string;
};

interface WorkLogState {
    entries: WorkLogEntry[];
    addEntry: (time: string, content: string) => void;
    clear: () => void;
}

export const useWorkLogStore = create<WorkLogState>((set) => ({
    entries: [],
    addEntry: (time, content) =>
        set((state) => ({
            entries: [
                ...state.entries,
                { id: state.entries.length + 1, time, content },
            ],
        })),
    clear: () => set({ entries: [] }),
}));
