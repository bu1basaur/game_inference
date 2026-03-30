// ──────────────────────────────────────────────────
// # 사운드 이벤트 상수
// ──────────────────────────────────────────────────

export const SND_EVT = {
    PLAY_SFX: "PLAY_SFX",
} as const;

export type EventKey = (typeof SND_EVT)[keyof typeof SND_EVT];
