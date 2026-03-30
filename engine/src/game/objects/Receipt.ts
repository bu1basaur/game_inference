// ──────────────────────────────────────────────────
// # 영수증 버튼
// ──────────────────────────────────────────────────

import { EventBus } from "../../events/EventBus";
import { GAME_EVT } from "../../events/GameEvt";

export class Receipt {
    constructor(scene: Phaser.Scene) {
        const btn = scene.add.rectangle(1200, 80, 120, 120, 0x444444);

        const label = scene.add
            .text(1200, 80, "Receipt", {
                fontSize: "18px",
                color: "#ffffff",
            })
            .setOrigin(0.5);

        btn.setInteractive({ useHandCursor: true });

        btn.on("pointerdown", () => {
            EventBus.emit(GAME_EVT.POPUP_OPEN);
            EventBus.emit("OPEN_RECEIPT");
        });

        // const receipt = scene.add
        //     .image(1200, 500, "receipt")
        //     .setInteractive({ useHandCursor: true });
        // receipt.on("pointerdown", () => {
        //     EventBus.emit("OPEN_RECEIPT");
        // });
    }
}
