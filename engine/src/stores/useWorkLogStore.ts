// ──────────────────────────────────────────────────
// # 근무일지 항목 목록
// ──────────────────────────────────────────────────

import { create } from "zustand";

export type WorkLogEntry = {
    id: string;
    time: string; // "HH:MM" 형식
    content: string; // 확정된 내용 또는 "?" (스킵)
    status: "confirmed" | "skipped";
};

interface WorkLogState {
    entries: WorkLogEntry[];
    addEntry: (time: string, content: string, status?: WorkLogEntry["status"]) => void;
    clear: () => void;
}

export const useWorkLogStore = create<WorkLogState>((set) => ({
    entries: [],
    addEntry: (time, content, status = "confirmed") =>
        set((state) => ({
            entries: [
                ...state.entries,
                {
                    id: `${Date.now()}`,
                    time,
                    content,
                    status,
                },
            ],
        })),
    clear: () => set({ entries: [] }),
}));
