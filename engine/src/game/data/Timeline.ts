// ──────────────────────────────────────────────────
// # 타임라인 이벤트 정의
// ──────────────────────────────────────────────────

import { GameState } from "./GameState";

export type TimelineEntry = {
    hour: number;
    minute: number;
    eventKey: string;
    condition?: () => boolean;
};

export const TIMELINE_EVENTS: TimelineEntry[] = [
    { hour: 7, minute: 0, eventKey: "shop_open" },
    { hour: 7, minute: 20, eventKey: "fly_add" },
    { hour: 7, minute: 30, eventKey: "homeless_visit_first" },
    { hour: 7, minute: 45, eventKey: "fly_add" },
    {
        hour: 8,
        minute: 0,
        eventKey: "scene_radio_news",
        condition: () => GameState.isRadioOn("news"),
    },
    { hour: 8, minute: 40, eventKey: "fly_add" },
    { hour: 10, minute: 14, eventKey: "fly_add" },
    { hour: 11, minute: 20, eventKey: "fly_add" },
    { hour: 12, minute: 0, eventKey: "fly_add" },
    { hour: 14, minute: 20, eventKey: "fly_add" },
    { hour: 15, minute: 45, eventKey: "fly_add" },
    { hour: 17, minute: 10, eventKey: "fly_add" },
    { hour: 18, minute: 40, eventKey: "fly_add" },

    // 타임라인 추가
];
