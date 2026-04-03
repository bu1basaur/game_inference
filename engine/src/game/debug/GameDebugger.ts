// ──────────────────────────────────────────────────
// # 개발용 디버그 도구
// ──────────────────────────────────────────────────

import { Game } from "../scenes/Game";
import { TIMELINE_EVENTS } from "../data/Timeline";
import { Trash } from "../objects/Trash";

export class GameDebugger {
    constructor(private game: Game) {}

    jumpToTime(hour: number, minute: number) {
        // 대화 초기화 (타이핑/선택지/창 모두) + 스파인 캐릭터 전부 제거
        this.game.dialogueManager.reset();
        this.game.characterManager.destroyAll();

        // 해당 시각 이전 이벤트 사이드 이펙트 적용
        const targetMinutes = hour * 60 + minute;
        TIMELINE_EVENTS.filter(
            (evt) => evt.hour * 60 + evt.minute < targetMinutes
        ).forEach((evt) => {
            if (evt.condition && !evt.condition()) return;
            this.runSideEffectsOnly(evt.eventKey);
        });

        // 해당 시각 직전으로 타임라인 설정 → 이후 이벤트 자연 발동
        this.game.timelineManager.setTimeBeforeEvent(hour, minute);
        this.game.timelineManager.resume();
    }

    private runSideEffectsOnly(eventKey: string) {
        this.game.timelineHandler.applySideEffects(eventKey);

        // 노숙자가 다녀간 상태 → trash 배치 (디버그 전용)
        if (eventKey === "homeless_visit_first") {
            const trash = new Trash(this.game);
            trash.show(700, 690);
        }
    }
}
