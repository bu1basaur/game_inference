// ──────────────────────────────────────────────────
// # 계산기 버튼
// ──────────────────────────────────────────────────

import { EventBus } from "../../events/EventBus";
import { GAME_EVT } from "../../events/GameEvt";

export class Calculator {
    private scene: Phaser.Scene;
    private image?: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;

        const btn = scene.add.rectangle(1600, 80, 120, 120, 0x444444);

        const label = scene.add
            .text(1600, 80, "Calculator", {
                fontSize: "18px",
                color: "#ffffff",
            })
            .setOrigin(0.5);

        btn.setInteractive();

        btn.on("pointerdown", () => {
            EventBus.emit(GAME_EVT.POPUP_OPEN);
            EventBus.emit("OPEN_CALCULATOR");
        });
    }

    show() {
        // this.image = this.scene.add
        //     .image(960, 650, "calculator")
        //     .setInteractive({ useHandCursor: true })
        //     .on("pointerdown", () => {
        //         EventBus.emit("OPEN_CALCULATOR");
        //     });
    }

    destroy() {
        this.image?.destroy();
    }
}
