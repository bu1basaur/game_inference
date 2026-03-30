// ──────────────────────────────────────────────────
// # 개발용 디버그 도구
// ──────────────────────────────────────────────────

import { Game } from "../scenes/Game";
import { TIMELINE_EVENTS } from "../data/Timeline";
import { Trash } from "../objects/Trash";

export class GameDebugger {
    constructor(private game: Game) {}

    startFrom(knot: string, hour?: number, minute?: number, runPrev = true) {
        if (hour !== undefined) {
            this.game.timelineManager.setTime(hour, minute ?? 0);
        }

        if (runPrev) {
            const targetMinutes = (hour ?? 7) * 60 + (minute ?? 0);
            TIMELINE_EVENTS.filter(
                (evt) => evt.hour * 60 + evt.minute < targetMinutes
            ).forEach((evt) => {
                if (evt.condition && !evt.condition()) return;
                this.runSideEffectsOnly(evt.eventKey);
            });
        }

        this.game.storyManager.jumpTo(knot);
        this.game.dialogueManager.setVisible(true);
        this.game.timelineManager.pause();
        this.game.advanceStory();
    }

    private runSideEffectsOnly(eventKey: string) {
        this.game.timelineHandler.applySideEffects(eventKey);

        // 노숙자가 다녀간 상태 → trash 배치 (디버그 전용)
        if (eventKey === "scene_homeless") {
            const trash = new Trash(this.game);
            trash.show(700, 650);
        }
    }
}
