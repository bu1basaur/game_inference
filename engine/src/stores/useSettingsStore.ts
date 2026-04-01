// ──────────────────────────────────────────────────
// # 게임 설정 상태 (음량, BGM 토글 등)
// ──────────────────────────────────────────────────

import { create } from "zustand";

interface SettingsState {
    bgmVolume: number;   // 0 ~ 1
    bgmEnabled: boolean;
    setBgmVolume: (v: number) => void;
    setBgmEnabled: (v: boolean) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
    bgmVolume: 0.7,
    bgmEnabled: true,
    setBgmVolume: (bgmVolume) => set({ bgmVolume }),
    setBgmEnabled: (bgmEnabled) => set({ bgmEnabled }),
}));
