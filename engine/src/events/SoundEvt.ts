export const SND_EVT = {
    PLAY_SFX: "PLAY_SFX",
} as const;

export type EventKey = (typeof SND_EVT)[keyof typeof SND_EVT];
