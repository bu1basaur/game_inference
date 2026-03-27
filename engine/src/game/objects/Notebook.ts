import { EventBus } from "../../events/EventBus";
import { GAME_EVT } from "../../events/GameEvt";

export class Notebook {
    constructor(scene: Phaser.Scene) {
        const btn = scene.add.rectangle(1200, 80, 120, 120, 0x444444);

        scene.add
            .text(1200, 80, "수첩", {
                fontSize: "18px",
                color: "#ffffff",
            })
            .setOrigin(0.5);

        btn.setInteractive({ useHandCursor: true });
        btn.on("pointerdown", () => {
            EventBus.emit(GAME_EVT.POPUP_OPEN);
            EventBus.emit(GAME_EVT.OPEN_NOTEBOOK);
        });
    }
}
