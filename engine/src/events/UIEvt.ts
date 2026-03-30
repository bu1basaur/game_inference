// ──────────────────────────────────────────────────
// UI 이벤트 상수
// ──────────────────────────────────────────────────

export const UI_EVT = {
    POPUP_OPEN: "POPUP_OPEN",
} as const;

export type EventKey = (typeof UI_EVT)[keyof typeof UI_EVT];
