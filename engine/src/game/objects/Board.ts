import { EventBus } from "../../events/EventBus";
import { GAME_EVT } from "../../events/GameEvt";

export class Board {
    private scene: Phaser.Scene;
    private image?: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;

        const btn = scene.add.rectangle(1400, 80, 120, 120, 0x444444);

        const label = scene.add
            .text(1400, 80, "Board", {
                fontSize: "18px",
                color: "#ffffff",
            })
            .setOrigin(0.5);

        btn.setInteractive({ useHandCursor: true });

        btn.on("pointerdown", () => {
            EventBus.emit(GAME_EVT.POPUP_OPEN);
            EventBus.emit("OPEN_BOARD");
        });
    }

    show() {
        // this.image = this.scene.add
        //     .image(1650, 350, "board")
        //     .setInteractive({ useHandCursor: true })
        //     .on("pointerdown", () => {
        //         EventBus.emit("OPEN_BOARD");
        //     });
    }
}
