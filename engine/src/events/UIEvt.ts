// ──────────────────────────────────────────────────
// UI 이벤트 상수
// ──────────────────────────────────────────────────

export const UI_EVT = {
    OPEN_POPUP: "OPEN_POPUP",
} as const;

export type EventKey = (typeof UI_EVT)[keyof typeof UI_EVT];
