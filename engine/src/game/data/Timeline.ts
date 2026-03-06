import { GameState } from "./GameState";

export type TimelineEntry = {
    hour: number;
    minute: number;
    eventKey: string;
    condition?: () => boolean;
};

export const TIMELINE_EVENTS: TimelineEntry[] = [
    { hour: 7, minute: 0, eventKey: "scene_open" },
    { hour: 7, minute: 30, eventKey: "scene_homeless" },
    {
        hour: 8,
        minute: 0,
        eventKey: "scene_radio_news",
        condition: () => GameState.isRadioOn("news"),
    },
    // 타임라인 추가
];
