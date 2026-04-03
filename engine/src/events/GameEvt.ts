// ──────────────────────────────────────────────────
// # 게임 이벤트 상수 모음
// ──────────────────────────────────────────────────

export const GAME_EVT = {
    /* ──────────────── 생명주기 ──────────────── */
    // 게임 전체 시작/종류
    GAME_START: "GAME_START",
    GAME_OVER: "GAME_OVER",

    /* ──────────────── 씬 전환 ──────────────── */
    // 씬 로딩 및 준비
    READY_SCENE: "READY_SCENE",
    OPEN_LOAD_OVERLAY: "OPEN_LOAD_OVERLAY",
    LOAD_READY: "LOAD_READY",
    GOTO_MAIN: "GOTO_MAIN",

    /* ──────────────── 게임 옵션 ──────────────── */
    OPEN_OPTIONS: "OPEN_OPTIONS",
    OPEN_GALLERY: "OPEN_GALLERY",
    OPEN_CREDITS: "OPEN_CREDITS",

    /* ──────────────── 게임 상태 ──────────────── */
    // 게임 일시정지 & 재개
    PAUSE: "PAUSE",
    RESUME: "RESUME",
    RESUMED: "RESUMED",

    /* ──────────────── 타임라인 ──────────────── */
    TIMELINE: "TIMELINE",
    TIMELINE_SKIP: "TIMELINE_SKIP",
    CLOSE_SHOP: "CLOSE_SHOP",

    /* ──────────────── 다이얼로그 ──────────────── */
    WAIT_DIALOGUE: "WAIT_DIALOGUE", // 수동 모드: 타이핑 완료. 클릭 대기 중.
    RESUME_DIALOGUE: "RESUME_DIALOGUE",

    /* ──────────────── UI 레이어 ──────────────── */
    // 팝업·오버레이·쪽지 등 화면 위에 띄우는 것들
    OPEN_POPUP: "OPEN_POPUP",
    CLOSE_POPUP: "CLOSE_POPUP",
    OPEN_NOTE: "OPEN_NOTE",
    CLOSE_NOTE: "CLOSE_NOTE",
    OPEN_NOTEBOOK: "OPEN_NOTEBOOK",
    OPEN_WORKLOG: "OPEN_WORKLOG",

    /* ──────────────── 디버그 ──────────────── */
    DEBUG_TIME_JUMP: "DEBUG_TIME_JUMP",

    /* ──────────────── 데이터 ──────────────── */
    // 저장·인벤토리·기록
    SAVE: "SAVE",
    SAVE_RESULT: "SAVE_RESULT",
    CONFIRM_INVENTORY: "CONFIRM_INVENTORY",
    ADD_WORKLOG: "ADD_WORKLOG",
} as const;

export type EventKey = (typeof GAME_EVT)[keyof typeof GAME_EVT];
