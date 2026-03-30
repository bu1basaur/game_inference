// ──────────────────────────────────────────────────
// # 타임라인 이벤트 처리
// ──────────────────────────────────────────────────

import { Game } from "./../game/scenes/Game";
import { BirdPoo } from "../game/objects/BirdPoo";

export class GameTimelineHandler {
    private poo?: BirdPoo;

    constructor(private game: Game) {}

    handle(eventKey: string) {
        this.applySideEffects(eventKey);

        if (eventKey === "fly_add") return;
        if (eventKey === "shop_close") return;

        this.game.storyManager.jumpTo(eventKey);
        this.game.timelineManager.slowDown();
        this.game.advanceStory();
    }

    /** 대화 없이 시각적 상태만 적용 */
    applySideEffects(eventKey: string) {
        if (eventKey === "scene_open") {
            this.poo = new BirdPoo(this.game);
            this.poo.show();
        }
        if (eventKey === "fly_add") {
            this.poo?.addFly();
        }
    }
}
