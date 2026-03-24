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

    // 씬 이동
    GOTO_MAIN: "GOTO_MAIN",

    // 팝업 오브젝트 여닫기
    POPUP_OPEN: "POPUP_OPEN",
    POPUP_CLOSE: "POPUP_CLOSE",

    // 타임라인
    TIMELINE: "timeline",
    SHOP_CLOSE: "shop_close",

    // 다이얼로그
    DIALOGUE_WAITING: "DIALOGUE_WAITING", // 수동 모드: 타이핑 완료. 클릭 대기 중.
    DIALOGUE_RESUME: "DIALOGUE_RESUME",

    // 쪽지
    NOTE_OPEN: "NOTE_OPEN",
    NOTE_CLOSE: "NOTE_CLOSE",
} as const;

export type EventKey = (typeof GAME_EVT)[keyof typeof GAME_EVT];
