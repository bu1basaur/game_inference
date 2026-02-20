export const GAME_EVT = {
    SCENE_READY: "SCENE_READY",
    GAME_START: "GAME_START",
    GAME_OVER: "GAME_OVER",
    PAUSE: "PAUSE",
    RESUME: "RESUME",
    RESUMED: "RESUMED",
} as const;

export type EventKey = (typeof GAME_EVT)[keyof typeof GAME_EVT];
