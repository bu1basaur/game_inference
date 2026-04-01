// ──────────────────────────────────────────────────
// # 사운드 이벤트 상수
// ──────────────────────────────────────────────────

export const SND_EVT = {
    PLAY_SFX: "PLAY_SFX",
    BGM_VOLUME: "BGM_VOLUME",   // payload: number (0~1)
    BGM_TOGGLE: "BGM_TOGGLE",   // payload: boolean (enabled)
} as const;

export type EventKey = (typeof SND_EVT)[keyof typeof SND_EVT];
