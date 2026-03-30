// ──────────────────────────────────────────────────
// # 근무일지 버튼
// ──────────────────────────────────────────────────

import { EventBus } from "../../events/EventBus";
import { GAME_EVT } from "../../events/GameEvt";

export class WorkLog {
    constructor(scene: Phaser.Scene) {
        const btn = scene.add.rectangle(1000, 80, 120, 120, 0x444444);

        scene.add
            .text(1000, 80, "근무일지", {
                fontSize: "18px",
                color: "#ffffff",
            })
            .setOrigin(0.5);

        btn.setInteractive({ useHandCursor: true });
        btn.on("pointerdown", () => {
            EventBus.emit(GAME_EVT.POPUP_OPEN);
            EventBus.emit(GAME_EVT.OPEN_WORKLOG);
        });
    }
}
