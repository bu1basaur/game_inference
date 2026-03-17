export const GAME_EVT = {
    // 씬 시작
    SCENE_READY: "SCENE_READY",

    // 게임 시작
    GAME_START: "GAME_START",
    GAME_OVER: "GAME_OVER",

    // 게임 일시정지 & 재개
    PAUSE: "PAUSE",
    RESUME: "RESUME",
    RESUMED: "RESUMED",

    // 타임라인
    TIMELINE: "timeline",
    SHOP_CLOSE: "shop_close",

    // 쪽지 보기 & 닫기
    OPEN_NOTE: "OPEN_NOTE",
    CLOSE_NOTE: "CLOSE_NOTE",
} as const;

export type EventKey = (typeof GAME_EVT)[keyof typeof GAME_EVT];
