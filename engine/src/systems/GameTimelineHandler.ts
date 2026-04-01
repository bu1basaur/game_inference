// ──────────────────────────────────────────────────
// # 타임라인 이벤트 처리
// ──────────────────────────────────────────────────

import { Game } from "./../game/scenes/Game";
import { BirdPoo } from "../game/objects/BirdPoo";
import { TIMELINE_EVENTS } from "../game/data/Timeline";
import { WORKLOG_SCHEDULE } from "../game/data/WorkLogSchedule";
import { useWorkLogStore } from "../stores/useWorkLogStore";

export class GameTimelineHandler {
    private poo?: BirdPoo;

    constructor(private game: Game) {}

    handle(eventKey: string) {
        this.applySideEffects(eventKey);

        // 근무일지 스케줄에 등록된 이벤트면 확정 항목 추가
        const schedule = WORKLOG_SCHEDULE.find((e) => e.eventKey === eventKey);
        if (schedule) {
            const entry = TIMELINE_EVENTS.find((e) => e.eventKey === eventKey);
            const time = entry
                ? `${String(entry.hour).padStart(2, "0")}:${String(entry.minute).padStart(2, "0")}`
                : this.game.timelineManager.getTimeString();
            useWorkLogStore.getState().addEntry(time, schedule.content, "confirmed");
        }

        if (eventKey === "fly_add") return;
        if (eventKey === "CLOSE_SHOP") return;

        this.game.storyManager.jumpTo(eventKey);
        this.game.timelineManager.slowDown();
        this.game.advanceStory();
    }

    /** 조건 불충족으로 스킵된 이벤트 처리 */
    handleSkip(eventKey: string, time: string) {
        const schedule = WORKLOG_SCHEDULE.find((w) => w.eventKey === eventKey);
        if (!schedule) return;
        useWorkLogStore.getState().addEntry(time, "?", "skipped");
    }

    /** 대화 없이 시각적 상태만 적용 */
    applySideEffects(eventKey: string) {
        if (eventKey === "shop_open") {
            this.poo = new BirdPoo(this.game);
            this.poo.show();
        }
        if (eventKey === "fly_add") {
            this.poo?.addFly();
        }
    }
}
